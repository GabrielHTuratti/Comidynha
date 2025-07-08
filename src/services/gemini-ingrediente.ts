import { IIngredienteItem } from "@/model/ingrediente";
import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({apiKey: "AIzaSyB6kd_CCSVN5iF-_K9CXz8in6V690MoZW8"});

export async function detectIngredients(imageBase64: string): Promise<IIngredienteItem[]> {
  try {
    const prompt = `
    Analise esta imagem e identifique todos os ingredientes visíveis. Para cada ingrediente detectado, forneça as seguintes informações em formato JSON:

    {
      "ingredientes": [
        {
            nome: string
            categoria: enum ["Vegetais", "Frutas", "Carnes", "Peixes","Laticínios","Cereais","Leguminosas","Oleaginosas","Temperos","Condimentos","Bebidas","Outros"]
            calorias_por_100g: number
            proteinas_por_100g: number
            carboidratos_por_100g: number
            gorduras_por_100g: number
            fibras_por_100g: number
            vitaminas: Map<string, number>
            minerais: Map<string, number>
            descricao: string
            tags: string[]
            origem: "manual" | "detectado" | "importado"
            data_criacao: Date
            data_atualizacao: Date
            confianca: number
            quantidade_estimada: string
    }

    Seja preciso, mas não seja especifico, pode ser generico nos nomes: (Leite integral, Arroz, Feijão, Ovos, macarrão). E não (Leite UHT Integral da marca ...... ou Macarrão espaguete das montanhas suíças (cru)) seja generico
    e desconsidere na imagem o que não for um ingrediente/alimento (objetos no geral). Se não conseguir identificar um ingrediente com certeza, indique uma confiança menor.
    Use dados nutricionais precisos baseados em tabelas nutricionais brasileiras (TACO).
    `

    const content = [
        {inlineData: {
            mimeType: "image/jpeg",
            data: imageBase64
        },},
        {text: prompt}    
    ];

    const response = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: content
    })
    const text = response.text || "Null";

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Não foi possível extrair dados JSON da resposta do Gemini")
    }

    const detectionResult: IIngredienteItem[] = JSON.parse(jsonMatch[0]).ingredientes
    for(const obj of detectionResult){
          obj.data_criacao = new Date();
    }

    return detectionResult
  } catch (error) {
    console.error("Erro na detecção de ingredientes:", error)
    throw new Error("Falha ao detectar ingredientes na imagem")
  }
}
