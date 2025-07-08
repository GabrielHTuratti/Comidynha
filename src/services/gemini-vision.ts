import { IRefeicao } from "@/model/refeicao";
import { GoogleGenAI } from "@google/genai";


const ai = new GoogleGenAI({apiKey: "AIzaSyB6kd_CCSVN5iF-_K9CXz8in6V690MoZW8"});

export async function analyzeMealImage(imageBase64: string): Promise<IRefeicao> {
  try {
    const raw_response = await analyzeWithGeminiVision(imageBase64);
    if(!raw_response){
      throw new Error("Sem resposta da IA")
    }
    const jsonStart = raw_response.indexOf('{');
    const jsonEnd = raw_response.lastIndexOf('}') + 1
    const jsonString = raw_response.slice(jsonStart, jsonEnd);

    const detectedMeal: IRefeicao = JSON.parse(jsonString);
    detectedMeal.data = new Date().toUTCString()

    return detectedMeal
  } catch (error) {
    throw new Error("Falha ao analisar a imagem. Tente novamente." + error)
  }
}

export async function analyzeWithGeminiVision(imageBase64: string) {
  const prompt = `
    Analise esta imagem de comida e retorne um JSON com as seguintes informações:


    - nome: nome do prato principal
    - ingredients: array com ingredientes identificados
    - desc: objeto com calories (número), protein, carbs, fat (strings com valores em gramas) e extra (outro objeto com nome e valor, este sera usado caso seja necessario atribuir um novo campo nutricional, como açucar, fibras, vitaminas etc... Apenas se for uma refeição "caprichada".)
    - confidence: número entre 0 e 1 indicando confiança na análise
    - suggestions: array com sugestões nutricionais (opcional)
    
    Por favor, também avalie sua confiança na análise (0-1) considerando:
    - Clareza da imagem
    - Reconhecimento de ingredientes
    - Precisão nutricional
    E retorne no campo "confidence_score"

    Seja preciso e realista nas estimativas nutricionais, e baseie-se nesse modelo:{
      nome: string
      confidence: number
      ingredients: [
      string, string, string
      ]
      desc: {
        proteinas: number
        carboidratos: number
        gorduras: number
        extra: [{
          campoid: number # numero aleatório de 5 digitos 
          nome: string
          valor: string
        },]
      }
      data: string #data atual brasil ex: 2025-07-02T16:45:59.338+00:00
      suggestions?: [
        string, string, string]
      "calorias": 0, // por padrão é 0, mas defina com base na estimativa
      "tipo": "cafe-da-manha" // com base no prato, defina se é ['cafe-da-manha', 'almoco', 'lanche-da-tarde', 'janta']
    }
  `

  try {
    const content = [
        {inlineData: {
            mimeType: "image/jpeg",
            data: imageBase64
        },},
        {text: prompt}    
    ];
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: content
    })
    return response.text;
  } catch (error) {
    throw new Error("Serviço de análise temporariamente indisponível" + error)
  }
}
