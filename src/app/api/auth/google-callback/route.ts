import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import User from "@/model/users"
import { dbConnect } from "@/lib/db"

export async function POST(request: Request) {
  try {
    await dbConnect()

    const body = await request.json()
    const { uid, email, name, photoURL, emailVerified } = body
    if (!uid || !email || !name) {
      return NextResponse.json({ error: "Dados obrigatórios não fornecidos" }, { status: 400 })
    }
    let user = await User.findOne({ email })

    if (!user) {
      user = await User.create({
        name: name,
        email: email,
        password: `google_${uid}`,
        plan: "Basico",
        reflimite: true,
        tokenVersion: 0,
        googleUid: uid,
        photoURL: photoURL,
        emailVerified: emailVerified,
      })
    }
    const refreshToken = jwt.sign(
      {
        userId: user._id,
        tokenVersion: user.tokenVersion,
      },
      process.env.REFRESH_TOKEN!,
      { expiresIn: "1d" },
    )

    const accessToken = jwt.sign(
      {
        email: user.email,
        name: user.name,
        userId: user._id,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "30m" },
    )

    // Configurar cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      domain: "comidynha.vercel.app"
    }

    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          plan: user.plan,
          reflimite: user.reflimite,
        },
      },
      { status: 200 },
    )

    // Definir cookies
    response.cookies.set("auth_token", accessToken, {
      ...cookieOptions,
      maxAge: 60 * 30, // 30 minutos
    })

    response.cookies.set("rfs_token", refreshToken, {
      ...cookieOptions,
      maxAge: 60 * 60 * 24, // 1 dia
    })

    return response
  } catch (error) {
    console.error("Erro no callback do Google:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
