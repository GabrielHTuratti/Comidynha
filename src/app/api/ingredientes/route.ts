import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Ingrediente, {IIngredienteItem } from "@/model/ingrediente"
import { jwtVerify } from "jose"
import { cookies } from "next/headers"
import { ShortIngredientsProps } from "@/types/intelligent-meal"
import { generateRandomID } from "@/services/v1"

export async function GET() {
  try {
    await dbConnect()

    const cookieStore = cookies();
    const token = (await cookieStore).get('auth_token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'N��o autorizado - Token não encontrado' },
        { status: 401 }
      );
    }
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const {payload} = await jwtVerify(token, secret)
    if (!payload.email) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }
    const useremail = payload.email


    const ingredientDocument = await Ingrediente.findOne({userEmail: useremail}).select({"ingredientes.nome": 1, "ingredientes.refid":1})
    const ingredientes:ShortIngredientsProps[] = ingredientDocument
    return NextResponse.json(ingredientes)
  } catch (error) {
    console.error("Erro ao buscar ingredientes:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect()
    const cookieStore = cookies();
    const token = (await cookieStore).get('auth_token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'N��o autorizado - Token não encontrado' },
        { status: 401 }
      );
    }
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const {payload} = await jwtVerify(token, secret)
    if (!payload.email) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }
    const useremail = payload.email
    const ingredientsDocument = await Ingrediente.findOne({userEmail: useremail})
    if(!ingredientsDocument){
      const data = await req.json()
      const novoIngrediente = new Ingrediente({userEmail: useremail, ingredientes: data})

      const ingredienteSalvo = await novoIngrediente.save()
      return NextResponse.json(
        {
          success: true,
          ingrediente: ingredienteSalvo,
        },
        { status: 201 },
      )
    }
    const data:IIngredienteItem[] = await req.json()
    for(const obj of data){
      obj.refid = generateRandomID(12)
    }


    
    const result = await Ingrediente.updateOne(
      { userEmail: useremail },
      [
        {
          $set: {
            ingredientes: {
              $concatArrays: [
                "$ingredientes",
                {
                  $filter: {
                    input: data,
                    as: "novo",
                    cond: {
                      $not: {
                        $in: ["$$novo.nome", "$ingredientes.nome"]
                      }
                    }
                  }
                }
              ]
            }
          }
        }
      ]
    );

    return NextResponse.json(
      {
        success: true,
        ingrediente: result,
      },
      { status: 201 },
    )


  } catch (error) {
    console.error("Erro ao criar ingrediente:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
