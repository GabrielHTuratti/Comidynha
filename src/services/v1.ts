import type { IRefeicao, RefeicaoTipo } from "@/model/refeicao"
import { updateAuthState } from "@/hooks/use-auth"
import { IDepositoInput, ObjetivoDeposito } from "@/model/deposito"
import { IFormDeposito } from "@/types/intelligent-meal"

const API = "/api"

export const authenticate = async (email: string, password: string) => {
  const response = await fetch(`/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  })
  if (!response.ok) {
    throw new Error(
      `${await response.json().then((data) => {
        return data.error
      })}`,
    )
  }

  // Após login bem-sucedido, atualizar estado de autenticação
  try {
    const profile = await getProfile()
    updateAuthState.setUser(profile)
  } catch (error) {
    console.error("Erro ao buscar perfil após login:", error)
  }

  const retorno = await response.status
  window.location.href = "/main"
  return retorno
}

export const registrar = async (email: string, name: string, password: string) => {
  const data = { email, name, password }
  const response = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  })
  if (!response.ok) {
    throw new Error(
      `${await response.json().then((data) => {
        return data.details
      })}`,
    )
  }

  // Após registro bem-sucedido, atualizar estado de autenticação
  try {
    const profile = await getProfile()
    updateAuthState.setUser(profile)
  } catch (error) {
    console.error("Erro ao buscar perfil após registro:", error)
  }

  const retorno = await response.json()
  window.location.href = "/main"
  return retorno
}

export const getProfile = async () => {
  const profile = await fetch(`${API}/auth/user`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  })
  if (!profile.ok)
    throw new Error(
      `${await profile.json().then((data) => {
        return data.error
      })}`,
    )
  const data = await profile.json()
  return data.user
}

export const createMeal = async (meals: IRefeicao) => {
  const user = await getProfile()
  if (user.plan === "Basico") {
    const meals = await getMeals()
    const mealsCount = filterMealsInMonth(meals).length
    if (mealsCount >= 20) {
      throw new Error(`Limite de 20 refeições mensais atingido para o plano gratuito!\n Quantidade atual:${mealsCount}`)
    }
  }

  const response = await fetch(`${API}/refeicao`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(meals),
    credentials: "include",
  })
  if (response.status != 201) {
    throw new Error(`Resposta inválida do sistema`)
  }
  const retorno = await response.json()
  return retorno
}

export const updateMeal = async (meals: IRefeicao) => {
  const response = await fetch(`${API}/refeicao`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(meals),
    credentials: "include",
  })
  if (!response.ok) {
    throw new Error(
      `${await response.json().then((data) => {
        return data.details
      })}`,
    )
  }
  const retorno = await response.json()
  return retorno
}

export const deleteMeal = async (meals: IRefeicao) => {
  const response = await fetch(`${API}/refeicao`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(meals),
    credentials: "include",
  })
  if (!response.ok) {
    throw new Error(
      `${await response.json().then((data) => {
        return data.details
      })}`,
    )
  }
  const retorno = await response.json()
  return retorno
}

export const getMeals = async (): Promise<IRefeicao[]> => {
  try {
    const response = await fetch(`${API}/refeicao`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.details || "Erro ao buscar refeições")
    }

    const data = await response.json()

    if (!Array.isArray(data)) {
      throw new Error("Resposta da API não é um array")
    }

    const validatedMeals = data.map((item: IRefeicao) => {
      const meal: IRefeicao = {
        useremail: item.useremail || "",
        refid: item.refid || "",
        nome: item.nome || "",
        confidence: item.confidence,
        ingredients: item.ingredients || [],
        desc: {
          proteinas: item.desc?.proteinas || "0",
          carboidratos: item.desc?.carboidratos || "0",
          gorduras: item.desc?.gorduras || "0",
          extra: item.desc?.extra || [],
        },
        calorias: item.calorias || 0,
        data: item.data || new Date().toISOString(),
        suggestions: item.suggestions || [],
        tipo: ["cafe-da-manha", "almoco", "lanche-da-tarde", "janta"].includes(item.tipo)
          ? (item.tipo as RefeicaoTipo)
          : "cafe-da-manha",
      }
      return meal
    })

    return validatedMeals
  } catch (error) {
    console.error("Erro em getMeals:", error)
    throw error
  }
}

export const logout = async () => {
  updateAuthState.clearUser()

  const response = await fetch(`${API}/auth/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  })
  if (!response.ok)
    throw new Error(
      `${await response.json().then((data) => {
        return data.details
      })}`,
    )

  window.location.href = "/auth/customer"
}

export const refresh = async () => {
  const response = await fetch(`${API}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  })
  if (!response.ok)
    throw new Error(
      `${await response.json().then((data) => {
        return data.details
      })}`,
    )
}

//========================================

function filterMealsInMonth(meals: IRefeicao[]) {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  return meals.filter((meal) => {
    try {
      if (!meal.data || isNaN(new Date(meal.data).getTime())) {
        console.log(`Refeição com data inválida: ${meal.refid}`)
        return false
      }
      const mealDate = new Date(meal.data)
      return mealDate.getMonth() === currentMonth && mealDate.getFullYear() === currentYear
    } catch (err) {
      console.log(`Erro ao processar data de refeição: ${meal.refid} \n Erro: ${err}`)
      return false
    }
  })
}

export function generateRandomID(length: number): string{
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  
  return result;
}

export const convertFormToDeposito = (
  formData: IFormDeposito,
  userEmail: string
): IDepositoInput => {
  return {
    nome: formData.nome,
    descricao: formData.descricao,
    objetivo: formData.objetivo as ObjetivoDeposito, // Conversão segura
    objetivo_personalizado: formData.objetivo_personalizado,
    userEmail,
    ingredientes: formData.ingredientes,
    configuracao: {
      calorias_alvo: formData.configuracao.calorias_alvo
        ? Number(formData.configuracao.calorias_alvo)
        : undefined,
      proteinas_min: formData.configuracao.proteinas_min
        ? Number(formData.configuracao.proteinas_min)
        : undefined,
      carboidratos_max: formData.configuracao.carboidratos_max
        ? Number(formData.configuracao.carboidratos_max)
        : undefined,
      gorduras_max: formData.configuracao.gorduras_max
        ? Number(formData.configuracao.gorduras_max)
        : undefined,
      fibras_min: formData.configuracao.fibras_min
        ? Number(formData.configuracao.fibras_min)
        : undefined,
      restricoes_alimentares: formData.configuracao.restricoes_alimentares,
      preferencias: formData.configuracao.preferencias,
    },
  };
};