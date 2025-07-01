import type { DetectedMeal } from "@/types/intelligent-meal"
import { GoogleGenAI } from "@google/genai";


const ai = new GoogleGenAI({apiKey: "AIzaSyB6kd_CCSVN5iF-_K9CXz8in6V690MoZW8"});

export async function analyzeMealImage(imageBase64: string): Promise<DetectedMeal> {
  try {
    // Simular análise da IA (substitua pela integração real com Gemini Vision)
    const ia_response = await analyzeWithGeminiVision(imageBase64)
    console.log(ia_response);
    const mockResponse: DetectedMeal = {
      name: "Salada Caesar com Frango",
      ingredients: ["Alface romana", "Peito de frango grelhado", "Queijo parmesão", "Croutons", "Molho caesar"],
      nutrition: {
        calories: 420,
        protein: "35",
        carbs: "12",
        fat: "28",
      },
      confidence: 0.87,
      suggestions: [
        "Adicione mais vegetais para aumentar as fibras",
        "Considere usar molho light para reduzir calorias",
      ],
    }

    return mockResponse
  } catch (error) {
    throw new Error("Falha ao analisar a imagem. Tente novamente." + error)
  }
}

// Função para integração real com Gemini Vision API
export async function analyzeWithGeminiVision(imageBase64: string) {
  const prompt = `
    Analise esta imagem de comida e retorne um JSON com as seguintes informações:
    - name: nome do prato principal
    - ingredients: array com ingredientes identificados
    - nutrition: objeto com calories (número), protein, carbs, fat (strings com valores em gramas)
    - confidence: número entre 0 e 1 indicando confiança na análise
    - suggestions: array com sugestões nutricionais (opcional)
    
    Seja preciso e realista nas estimativas nutricionais, e baseie-se nesse modelo:{
      "nome": "string",
      "desc": {
        "proteinas": "string", // deixe como (numero)g ou (numero)kg
        "carboidratos": "string",  // deixe como (numero)g ou (numero)kg
        "gorduras": "string",  // deixe como (numero)g ou (numero)kg
        "extra": [
          {
            "nome": "string", // caso pareça necessario considerar um valor extra, como açucar, vitamina, etc...
            "valor": "string" // este valor pode ser um numero ou uma string
          }
        ]
      },
      "calorias": 0, // por padrão é 0, mas defina com base na estimativa
      "data": "2025-06-20T12:00:00.000Z" // data atual só que nesse formato
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
