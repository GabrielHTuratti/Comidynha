import { type NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/db"
import User from "@/model/users"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

export async function PUT(request: NextRequest) {
  try {
    await dbConnect()

    const token = request.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ message: "Token não encontrado" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    const { name, email, currentPassword, newPassword } = await request.json()

    const user = await User.findById(decoded.userId).select("+password")
    if (!user) {
      return NextResponse.json({ message: "Usuário não encontrado" }, { status: 404 })
    }

    // Verificar se email já existe (se foi alterado)
    if (email !== user.email) {
      const existingUser = await User.findOne({ email, _id: { $ne: decoded.userId } })
      if (existingUser) {
        return NextResponse.json({ message: "Email já está em uso" }, { status: 400 })
      }
    }

    // Se está alterando senha, verificar senha atual
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ message: "Senha atual é obrigatória" }, { status: 400 })
      }

      const isCurrentPasswordValid = await user.comparePassword(currentPassword)
      if (!isCurrentPasswordValid) {
        return NextResponse.json({ message: "Senha atual incorreta" }, { status: 400 })
      }

      // Hash da nova senha
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(newPassword, salt)
    }

    // Atualizar dados
    user.name = name
    user.email = email
    await user.save()

    // Retornar dados atualizados (sem senha)
    const updatedUser = await User.findById(decoded.userId)
    return NextResponse.json({
      message: "Dados atualizados com sucesso",
      user: updatedUser,
    })
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}
