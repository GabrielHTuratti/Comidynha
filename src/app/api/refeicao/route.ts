import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import dbConnect from "@/lib/db"
import Meal from "@/model/refeicao"
import { cookies } from "next/headers"
import { checkMealLimit } from "@/lib/limit-checker"

export async function GET() {
  try {
    const token = (await cookies()).get("auth_token")?.value
    if (!token) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      email: string
      userId: string
    }
    if (!decoded.email) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 })
    }
    await dbConnect()
    const meals = await Meal.find({ useremail: decoded.email })
    return NextResponse.json(meals)
  } catch (error) {
    console.error("Erro ao buscar refeições:", error)

    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: "Token inválido ou expirado" }, { status: 401 })
    }

    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect()
    const body = await request.json()

    // Verificar limite antes de criar a refeição
    if (body.useremail) {
      const limitCheck = await checkMealLimit(body.useremail)

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

    const meal = await Meal.create(body)
    return NextResponse.json(
      {
        meal,
        limitInfo: body.useremail ? await checkMealLimit(body.useremail) : null,
      },
      { status: 201 },
    )
  } catch (err) {
    return NextResponse.json(err, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    await dbConnect()
    const body = await request.json()
    const meal = await Meal.findOneAndDelete({ refid: body.refid })
    return NextResponse.json(meal, { status: 201 })
  } catch (err) {
    return NextResponse.json(err, { status: 500 })
  }
}

export async function PUT(request: Request) {
  await dbConnect()
  const body = await request.json()
  const { _id, ...updateData } = body
  const meal = await Meal.updateOne({ _id }, { $set: updateData })
  return NextResponse.json(meal, { status: 201 })
}
