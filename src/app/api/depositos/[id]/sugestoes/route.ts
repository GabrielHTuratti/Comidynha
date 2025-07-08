import { type NextRequest, NextResponse } from "next/server"
import Deposito from "@/model/deposito"
import Ingrediente, { IIngredienteItem } from "@/model/ingrediente"
import { dbConnect } from "@/lib/db"
import { generateSuggestions } from "@/services/gemini-suggestions"



export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const body = await request.json()

    const deposito = await Deposito.findById(body.id)
    if (!deposito) {
      return NextResponse.json({ error: "Depósito não encontrado" }, { status: 404 })
    }
    const ingredientesDetalhadosDocs = await Ingrediente.find({
      userEmail: deposito.userEmail,
      "ingredientes.refid": { 
        $in: deposito.ingredientes.map((ing: { refid: string }) => ing.refid) 
      }
    }).lean();

    if (ingredientesDetalhadosDocs.length === 0) {
      return NextResponse.json({ error: "Nenhum ingrediente encontrado no depósito" }, { status: 400 });
    }

    const ingredientesDetalhadosItems: IIngredienteItem[] = ingredientesDetalhadosDocs
      .flatMap(doc => doc.ingredientes)
      .filter(ing => deposito.ingredientes.some((depIng: { refid: string }) => depIng.refid === ing.refid));

    const sugestoes = await generateSuggestions({
      deposito,
      ingredientesDetalhados: ingredientesDetalhadosItems,
    });

    deposito.sugestoes_geradas = sugestoes
    deposito.ultima_sugestao = new Date()
    await deposito.save()

    return NextResponse.json({
      message: "Sugestões geradas com sucesso",
      sugestoes,
      ingredientes_utilizados: ingredientesDetalhadosDocs.length,
      total_receitas: sugestoes.receitas?.length || 0,
      total_refeicoes: sugestoes.refeicoes?.length || 0,
    })
  } catch (error) {
    console.error("Erro ao gerar sugestões:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
