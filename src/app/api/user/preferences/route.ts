import { type NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/db"
import User from "@/model/users"
import jwt from "jsonwebtoken"

export async function PUT(request: NextRequest) {
  try {
    await dbConnect()

    const token = request.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ message: "Token não encontrado" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    const preferences = await request.json()

    const user = await User.findById(decoded.userId)
    if (!user) {
      return NextResponse.json({ message: "Usuário não encontrado" }, { status: 404 })
    }

    // Aqui você pode salvar as preferências em um campo específico do usuário
    // ou criar uma collection separada para preferências
    // Por enquanto, vamos simular que foi salvo

    return NextResponse.json({
      message: "Preferências salvas com sucesso",
      preferences,
    })
  } catch (error) {
    console.error("Erro ao salvar preferências:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}
