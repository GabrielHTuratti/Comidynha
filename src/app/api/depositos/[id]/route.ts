import { NextResponse } from "next/server"
import Deposito from "@/model/deposito"
import { dbConnect } from "@/lib/db"
import { jwtVerify } from "jose"
import { cookies } from "next/headers"

export async function GET(
  request: Request,
  {params}: {params: Promise<{ id: string }>}) 
  {
  try {
    await dbConnect()
    const deposito = await Deposito.findById((await params).id)

    if (!deposito) {
      return NextResponse.json(
        { error: "Depósito não encontrado" }, 
        { status: 404 }
      )
    }

    return NextResponse.json({ deposito })
  } catch (error) {
    console.error("Erro ao buscar depósito:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" }, 
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  {params}: {params: Promise<{ id: string }>})
  {
  try {
    await dbConnect()
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value
    
    if (!token) {
      return NextResponse.json(
        { error: "Não autorizado - Token não encontrado" }, 
        { status: 401 }
      )
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    
    if (!payload.email) {
      return NextResponse.json(
        { error: "Token inválido" }, 
        { status: 401 }
      )
    }

    const useremail = payload.email
    const data = await request.json()

    const deposito = await Deposito.findOneAndUpdate(
      { _id: (await params).id, userEmail: useremail },
      {
        nome: data.nome,
        descricao: data.descricao,
        objetivo: data.objetivo,
        objetivo_personalizado: data.objetivo_personalizado,
        ingredientes: data.ingredientes,
        configuracao: data.configuracao,
        data_atualizacao: new Date(),
      },
      { new: true }
    )

    if (!deposito) {
      return NextResponse.json(
        { error: "Depósito não encontrado" }, 
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: "Depósito atualizado com sucesso",
      deposito,
    })
  } catch (error) {
    console.error("Erro ao atualizar depósito:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" }, 
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  {params}: {params: Promise<{ id: string }>}) {
  try {
    await dbConnect()
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value
    
    if (!token) {
      return NextResponse.json(
        { error: "Não autorizado - Token não encontrado" }, 
        { status: 401 }
      )
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    
    if (!payload.email) {
      return NextResponse.json(
        { error: "Token inválido" }, 
        { status: 401 }
      )
    }

    const useremail = payload.email
    const result = await Deposito.findOneAndDelete({
      _id: (await params).id,
      userEmail: useremail
    })

    if (!result) {
      return NextResponse.json(
        { error: "Depósito não encontrado" }, 
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Depósito deletado com sucesso"
    })
  } catch (error) {
    console.error("Erro ao deletar depósito:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" }, 
      { status: 500 }
    )
  }
}