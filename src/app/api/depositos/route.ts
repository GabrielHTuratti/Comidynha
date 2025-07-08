import { type NextRequest, NextResponse } from "next/server"
import Deposito, { type IDeposito } from "@/model/deposito"
import { dbConnect } from "@/lib/db"
import { jwtVerify } from "jose"
import { cookies } from "next/headers"
import { checkDepositoLimit } from "@/lib/limit-checker"

export async function GET() {
  try {
    await dbConnect()

    const cookieStore = cookies()
    const token = (await cookieStore).get("auth_token")?.value
    if (!token) {
      return NextResponse.json({ error: "Não autorizado - Token não encontrado" }, { status: 401 })
    }
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    if (!payload.email) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 })
    }
    const useremail = payload.email

    if (!useremail) {
      return NextResponse.json({ error: "Email do usuário é obrigatório" }, { status: 400 })
    }

    const depositos: IDeposito[] = await Deposito.find({ userEmail: useremail })

    // Incluir informações de limite na resposta
    const limitInfo = await checkDepositoLimit(useremail as string)

    return NextResponse.json({
      depositos: depositos,
      total: depositos.length,
      limitInfo,
    })
  } catch (error) {
    console.error("Erro ao buscar depósitos:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const data = await request.json()

    // Verificar limite antes de criar o depósito
    if (data.userEmail) {
      const limitCheck = await checkDepositoLimit(data.userEmail)

      if (!limitCheck.allowed) {
        return NextResponse.json(
          {
            error: "Limite atingido",
            message: limitCheck.message,
            currentCount: limitCheck.currentCount,
            limit: limitCheck.limit,
          },
          { status: 429 }, // Too Many Requests
        )
      }
    }

    if (!Array.isArray(data.ingredientes)) {
      throw new Error("Formato inválido para ingredientes")
    }

    const novoDeposito = new Deposito({
      nome: data.nome,
      descricao: data.descricao,
      objetivo: data.objetivo,
      objetivo_personalizado: data.objetivo_personalizado,
      userEmail: data.userEmail,
      ingredientes: data.ingredientes,
      configuracao: {
        calorias_alvo: data.configuracao?.calorias_alvo,
        proteinas_min: data.configuracao?.proteinas_min,
        carboidratos_max: data.configuracao?.carboidratos_max,
        gorduras_max: data.configuracao?.gorduras_max,
        fibras_min: data.configuracao?.fibras_min,
        restricoes_alimentares: data.configuracao?.restricoes_alimentares || [],
        preferencias: data.configuracao?.preferencias || [],
      },
      sugestoes_geradas: {
        receitas: [],
        refeicoes: [],
        dicas_nutricionais: [],
        combinacoes_sugeridas: [],
      },
      createdAt: new Date(), // Adicionar timestamp para controle de limite
    })

    const depositoSalvo = await novoDeposito.save()

    // Incluir informações atualizadas de limite na resposta
    const limitInfo = await checkDepositoLimit(data.userEmail)

    return NextResponse.json({
      message: "Depósito criado com sucesso",
      deposito: depositoSalvo,
      limitInfo,
    })
  } catch (error) {
    console.error("Erro ao criar depósito:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
