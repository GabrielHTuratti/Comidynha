import { type NextRequest, NextResponse } from "next/server"
import Ingrediente, { type IIngredienteItem } from "@/model/ingrediente"
import { dbConnect } from "@/lib/db"
import { detectIngredients } from "@/services/gemini-ingrediente"
import { jwtVerify } from "jose"
import { cookies } from "next/headers"
import { checkIngredientDetectionLimit } from "@/lib/limit-checker"

export async function POST(request: NextRequest) {
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

    const userEmail = payload.email as string

    const limitCheck = await checkIngredientDetectionLimit(userEmail)

    if (!limitCheck.allowed) {
      return NextResponse.json(
        {
          error: "Limite atingido",
          message: limitCheck.message,
          currentCount: limitCheck.currentCount,
          limit: limitCheck.limit,
        },
        { status: 429 },
      )
    }

    const { image } = await request.json()

    if (!image) {
      return NextResponse.json({ error: "Imagem é obrigatória" }, { status: 400 })
    }

    const detectionResult: IIngredienteItem[] = await detectIngredients(image)

    const ingredientesExistentes = await Ingrediente.find({
      nome: { $in: detectionResult.map((ing) => ing.nome.toLowerCase()) },
    })

    const ingredientesComStatus = detectionResult.map((ingrediente) => ({
      ...ingrediente,
      nome: ingrediente.nome.toLowerCase(),
      _id: ingredientesExistentes.find((ing) => ing.nome === ingrediente.nome.toLowerCase())?._id,
    }))

    // Incluir informações atualizadas de limite na resposta
    const updatedLimitInfo = await checkIngredientDetectionLimit(userEmail)

    return NextResponse.json({
      userEmail: payload.email,
      ingredientes: ingredientesComStatus,
      limitInfo: updatedLimitInfo,
    })
  } catch (error) {
    console.error("Erro ao detectar ingredientes:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
