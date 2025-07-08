import type { IDeposito } from "@/model/deposito"
import type { IIngredienteItem } from "@/model/ingrediente"


import { GoogleGenAI } from "@google/genai";


const genAI = new GoogleGenAI({apiKey: "AIzaSyB6kd_CCSVN5iF-_K9CXz8in6V690MoZW8"});

interface SuggestionRequest {
  deposito: IDeposito
  ingredientesDetalhados: IIngredienteItem[]
}

interface SuggestionResponse {
  receitas: Array<{
    nome: string
    ingredientes_usados: string[]
    ingredientes_extras?: string[]
    modo_preparo: string[]
    tempo_preparo: number
    dificuldade: "facil" | "medio" | "dificil"
    calorias_estimadas: number
    macros: {
      proteinas: number
      carboidratos: number
      gorduras: number
    }
    tags: string[]
    confianca: number
  }>
  refeicoes: Array<{
    nome: string
    tipo: "cafe-da-manha" | "almoco" | "lanche-da-tarde" | "janta"
    ingredientes_principais: string[]
    ingredientes_complementares?: string[]
    observacoes: string
    calorias_estimadas: number
    macros: {
      proteinas: number
      carboidratos: number
      gorduras: number
    }
    confianca: number
  }>
  dicas_nutricionais: string[]
  combinacoes_sugeridas: Array<{
    ingredientes: string[]
    beneficio: string
    quando_consumir: string
  }>
}

export async function generateSuggestions({
  deposito,
  ingredientesDetalhados,
}: SuggestionRequest): Promise<SuggestionResponse> {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    throw new Error("Chave da API do Gemini não configurada")
  }

  const objetivoDescricoes = {
    "ganho-muscular": "Foco em alto teor proteico, calorias adequadas para ganho de massa muscular",
    "perda-peso": "Baixas calorias, alto teor de fibras, saciedade prolongada",
    manutencao: "Equilibrio nutricional, manutenção do peso atual",
    "receitas-doces": "Sobremesas e doces saudáveis, com foco no sabor",
    "jantar-romantico": "Pratos sofisticados e elegantes para ocasiões especiais",
    "almoco-rapido": "Refeições práticas e rápidas de preparar",
    "cafe-da-manha": "Refeições matinais nutritivas e energéticas",
    "lanche-saudavel": "Lanches nutritivos entre as refeições principais",
    "comida-vegana": "Receitas 100% vegetais, sem produtos de origem animal",
    "low-carb": "Baixo teor de carboidratos, foco em proteínas e gorduras boas",
    "dieta-mediterranea": "Baseada na dieta mediterrânea tradicional",
    personalizado: deposito.objetivo_personalizado || "Objetivo personalizado",
  }
  const prompt = `
Você é um nutricionista especializado e chef de cozinha. Analise os ingredientes disponíveis e gere sugestões personalizadas STRICTAMENTE no formato JSON especificado abaixo, sem nenhum texto adicional antes ou depois.

INFORMAÇÕES DO DEPÓSITO:
- Nome: ${deposito.nome}
- Descrição: ${deposito.descricao}
- Objetivo: ${objetivoDescricoes[deposito.objetivo]}
- Configurações:
  ${deposito.configuracao.calorias_alvo ? `- Meta de calorias: ${deposito.configuracao.calorias_alvo} kcal` : ""}
  ${deposito.configuracao.proteinas_min ? `- Proteínas mínimas: ${deposito.configuracao.proteinas_min}g` : ""}
  ${deposito.configuracao.carboidratos_max ? `- Carboidratos máximos: ${deposito.configuracao.carboidratos_max}g` : ""}
  ${deposito.configuracao.gorduras_max ? `- Gorduras máximas: ${deposito.configuracao.gorduras_max}g` : ""}
  ${deposito.configuracao.restricoes_alimentares.length > 0 ? `- Restrições: ${deposito.configuracao.restricoes_alimentares.join(", ")}` : ""}
  ${deposito.configuracao.preferencias.length > 0 ? `- Preferências: ${deposito.configuracao.preferencias.join(", ")}` : ""}

INGREDIENTES DISPONÍVEIS:
${ingredientesDetalhados.map(ing => `
- ${ing.nome} (${ing.categoria})
  Calorias: ${ing.calorias_por_100g}/100g | Proteínas: ${ing.proteinas_por_100g}g | Carboidratos: ${ing.carboidratos_por_100g}g | Gorduras: ${ing.gorduras_por_100g}g
  Descrição: ${ing.descricao}
  Tags: ${ing.tags.join(", ")}`).join("\n")}

Gere UM ÚNICO OBJETO JSON válido, sem markdown, contendo:

1. Pelo menos 3 receitas completas
2. Pelo menos 3 sugestões de refeições completas
3. Pelo menos 2 dicas nutricionais relevantes
4. Pelo menos 2 combinações de ingredientes

FORMATO EXATO REQUERIDO (inclua TODOS os campos, mesmo que vazios):

{
  "receitas": [
    {
      "nome": "string",
      "ingredientes_usados": ["string"],
      "ingredientes_extras": ["string"],
      "modo_preparo": ["string"],
      "tempo_preparo": number,
      "dificuldade": "facil"|"medio"|"dificil",
      "calorias_estimadas": number,
      "macros": {
        "proteinas": number,
        "carboidratos": number,
        "gorduras": number
      },
      "tags": ["string"],
      "confianca": number
    }
  ],
  "refeicoes": [
    {
      "nome": "string",
      "tipo": "cafe-da-manha"|"almoco"|"lanche-da-tarde"|"janta",
      "ingredientes_principais": ["string"],
      "ingredientes_complementares": ["string"],
      "observacoes": "string",
      "calorias_estimadas": number,
      "macros": {
        "proteinas": number,
        "carboidratos": number,
        "gorduras": number
      },
      "confianca": number
    }
  ],
  "dicas_nutricionais": ["string"],
  "combinacoes_sugeridas": [
    {
      "ingredientes": ["string"],
      "beneficio": "string",
      "quando_consumir": "string"
    }
  ]
}

REGRAS ABSOLUTAS:
1. Use SOMENTE os ingredientes listados em 'INGREDIENTES DISPONÍVEIS'
2. Calcule os valores nutricionais com base nas quantidades reais dos ingredientes
3. O JSON DEVE SER VÁLIDO e seguir EXATAMENTE o formato especificado
4. Não inclua nenhum texto adicional além do JSON
5. Para 'ingredientes_extras', sugira apenas temperos básicos (sal, pimenta, etc.)
6. O nível de confiança deve refletir a adequação ao objetivo (70-100)
7. Todos os campos devem estar preenchidos, mesmo que com array vazio

EXEMPLO DE RESPOSTA ACEITÁVEL (apenas o JSON):

{
  "receitas": [
    {
      "nome": "Omelete de Vegetais",
      "ingredientes_usados": ["ovos", "espinafre", "tomate"],
      "ingredientes_extras": ["sal", "pimenta"],
      "modo_preparo": [
        "Bata os ovos",
        "Misture com vegetais picados",
        "Cozinhe em fogo médio"
      ],
      "tempo_preparo": 15,
      "dificuldade": "facil",
      "calorias_estimadas": 280,
      "macros": {
        "proteinas": 22,
        "carboidratos": 8,
        "gorduras": 18
      },
      "tags": ["proteico", "rapido"],
      "confianca": 90
    }
  ],
  "refeicoes": [
    {
      "nome": "Almoço Proteico",
      "tipo": "almoco",
      "ingredientes_principais": ["frango", "brócolis"],
      "ingredientes_complementares": ["arroz integral"],
      "observacoes": "Cozinhe o frango com ervas",
      "calorias_estimadas": 450,
      "macros": {
        "proteinas": 35,
        "carboidratos": 40,
        "gorduras": 12
      },
      "confianca": 85
    }
  ],
  "dicas_nutricionais": [
    "Combine proteínas com fibras para melhor saciedade"
  ],
  "combinacoes_sugeridas": [
    {
      "ingredientes": ["ovos", "espinafre"],
      "beneficio": "Aumenta a absorção de ferro",
      "quando_consumir": "Café da manhã"
    }
  ]
}`

  try {
    const content = [

        {text: prompt}    
    ];

    const response = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: content
    })
    const text = response.text || "Null";

    const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim()
    const result = JSON.parse(cleanedText)

    return result as SuggestionResponse
  } catch (error) {
    console.error("Erro ao gerar sugestões:", error)
    throw new Error("Falha na geração de sugestões")
  }
}
