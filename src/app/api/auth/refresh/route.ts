import { jwtVerify } from "jose"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import User from "@/model/users"
import { dbConnect } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const refreshToken = (await cookies()).get("rfs_token")?.value
    const redirectURL = request.cookies.get("redirect_url")?.value || "/main"

    if (!refreshToken) {
      return NextResponse.json({ error: "Não autorizado - Token não encontrado" }, { status: 401 })
    }

    const secret = new TextEncoder().encode(process.env.REFRESH_TOKEN)
    let payload

    try {
      const result = await jwtVerify(refreshToken, secret)
      payload = result.payload
    } catch (jwtError) {

      console.log(jwtError)
      const response = NextResponse.redirect(new URL("/auth/customer", request.url))
      response.cookies.delete("auth_token")
      response.cookies.delete("rfs_token")

      return response
    }

    const user = await User.findById(payload.userId)

    if (!user) {

      const response = NextResponse.redirect(new URL("/auth/customer", request.url))
      response.cookies.delete("auth_token")
      response.cookies.delete("rfs_token")

      return response
    }

    if (payload.tokenVersion !== user.tokenVersion) {

      const response = NextResponse.redirect(new URL("/auth/customer", request.url))
      response.cookies.delete("auth_token")
      response.cookies.delete("rfs_token")

      return response
    }

    const newAccessToken = jwt.sign(
      {
        email: user.email,
        name: user.name,
        userId: user._id,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "30m" },
    )


    const response = NextResponse.redirect(new URL(redirectURL, request.url))

    response.cookies.set("auth_token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 30, // 30 minutos
    })

    response.cookies.set("rfs_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 dia
    })

    return response
  } catch (error) {
    console.error("Erro no refresh:", error)

    const response = NextResponse.redirect(new URL("/auth/customer", request.url))
    response.cookies.delete("auth_token")
    response.cookies.delete("rfs_token")

    return response
  }
}
