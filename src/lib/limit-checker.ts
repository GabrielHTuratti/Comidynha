import { dbConnect } from "@/lib/db"
import User from "@/model/users"
import Meal from "@/model/refeicao"
import Deposito from "@/model/deposito"

// Limites semanais para contas gratuitas
export const WEEKLY_LIMITS = {
  MEALS: 5, // 10 refeições por semana
  DEPOSITOS: 1, // 3 depósitos por semana
  INGREDIENT_DETECTION: 5, // 15 detecções de ingredientes por semana
  AI_SUGGESTIONS: 5, // 20 sugestões de IA por semana
} as const

export interface LimitCheckResult {
  allowed: boolean
  currentCount: number
  limit: number
  message: string
}

// Função para obter o início da semana atual (domingo)
function getWeekStart(): Date {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - dayOfWeek)
  weekStart.setHours(0, 0, 0, 0)
  return weekStart
}

// Função para obter o fim da semana atual (sábado)
function getWeekEnd(): Date {
  const weekStart = getWeekStart()
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)
  weekEnd.setHours(23, 59, 59, 999)
  return weekEnd
}

// Verificar se o usuário tem limite ativo
export async function hasActiveLimit(userEmail: string): Promise<boolean> {
  try {
    await dbConnect()
    const user = await User.findOne({ email: userEmail })
    return user?.reflimit === true
  } catch (error) {
    console.error("Erro ao verificar limite do usuário:", error)
    return true // Por segurança, assumir que tem limite se houver erro
  }
}

// Verificar limite de refeições
export async function checkMealLimit(userEmail: string): Promise<LimitCheckResult> {
  try {
    const hasLimit = await hasActiveLimit(userEmail)

    if (!hasLimit) {
      return {
        allowed: true,
        currentCount: 0,
        limit: -1,
        message: "Sem limite - conta premium",
      }
    }

    await dbConnect()
    const weekStart = getWeekStart()
    const weekEnd = getWeekEnd()

    const currentCount = await Meal.countDocuments({
      useremail: userEmail,
      data: {
        $gte: weekStart.toISOString(),
        $lte: weekEnd.toISOString(),
      },
    })

    const allowed = currentCount < WEEKLY_LIMITS.MEALS

    return {
      allowed,
      currentCount,
      limit: WEEKLY_LIMITS.MEALS,
      message: allowed
        ? `${currentCount}/${WEEKLY_LIMITS.MEALS} refeições esta semana`
        : `Limite semanal de ${WEEKLY_LIMITS.MEALS} refeições atingido! Atual: ${currentCount}`,
    }
  } catch (error) {
    console.error("Erro ao verificar limite de refeições:", error)
    return {
      allowed: false,
      currentCount: 0,
      limit: WEEKLY_LIMITS.MEALS,
      message: "Erro ao verificar limite",
    }
  }
}

// Verificar limite de depósitos
export async function checkDepositoLimit(userEmail: string): Promise<LimitCheckResult> {
  try {
    const hasLimit = await hasActiveLimit(userEmail)

    if (!hasLimit) {
      return {
        allowed: true,
        currentCount: 0,
        limit: -1,
        message: "Sem limite - conta premium",
      }
    }

    await dbConnect()
    const weekStart = getWeekStart()
    const weekEnd = getWeekEnd()

    const currentCount = await Deposito.countDocuments({
      userEmail: userEmail,
      createdAt: {
        $gte: weekStart,
        $lte: weekEnd,
      },
    })

    const allowed = currentCount < WEEKLY_LIMITS.DEPOSITOS

    return {
      allowed,
      currentCount,
      limit: WEEKLY_LIMITS.DEPOSITOS,
      message: allowed
        ? `${currentCount}/${WEEKLY_LIMITS.DEPOSITOS} depósitos esta semana`
        : `Limite semanal de ${WEEKLY_LIMITS.DEPOSITOS} depósitos atingido! Atual: ${currentCount}`,
    }
  } catch (error) {
    console.error("Erro ao verificar limite de depósitos:", error)
    return {
      allowed: false,
      currentCount: 0,
      limit: WEEKLY_LIMITS.DEPOSITOS,
      message: "Erro ao verificar limite",
    }
  }
}

// Verificar limite de detecção de ingredientes
export async function checkIngredientDetectionLimit(userEmail: string): Promise<LimitCheckResult> {
  try {
    const hasLimit = await hasActiveLimit(userEmail)

    if (!hasLimit) {
      return {
        allowed: true,
        currentCount: 0,
        limit: -1,
        message: "Sem limite - conta premium",
      }
    }

    await dbConnect()

    // Vamos usar uma coleção separada para rastrear detecções ou usar logs
    // Por enquanto, vamos simular baseado em uma estimativa
    const weekStart = getWeekStart()
    const currentCount = await getDetectionCountFromLogs(userEmail, weekStart)

    const allowed = currentCount < WEEKLY_LIMITS.INGREDIENT_DETECTION

    return {
      allowed,
      currentCount,
      limit: WEEKLY_LIMITS.INGREDIENT_DETECTION,
      message: allowed
        ? `${currentCount}/${WEEKLY_LIMITS.INGREDIENT_DETECTION} detecções esta semana`
        : `Limite semanal de ${WEEKLY_LIMITS.INGREDIENT_DETECTION} detecções atingido! Atual: ${currentCount}`,
    }
  } catch (error) {
    console.error("Erro ao verificar limite de detecção:", error)
    return {
      allowed: false,
      currentCount: 0,
      limit: WEEKLY_LIMITS.INGREDIENT_DETECTION,
      message: "Erro ao verificar limite",
    }
  }
}

// Função auxiliar para contar detecções (implementação simplificada)
async function getDetectionCountFromLogs(userEmail: string, weekStart: Date): Promise<number> {
  // Por enquanto, vamos usar uma implementação simples
  // Em produção, você deveria ter uma coleção específica para logs de uso
  try {
    // Simulação baseada no número de refeições criadas esta semana
    // (assumindo que cada refeição representa uma detecção)
    const weekEnd = getWeekEnd()
    const mealCount = await Meal.countDocuments({
      useremail: userEmail,
      data: {
        $gte: weekStart.toISOString(),
        $lte: weekEnd.toISOString(),
      },
    })

    // Estimativa: cada refeição = 1-2 detecções
    return Math.floor(mealCount * 1.5)
  } catch (error) {
    console.error("Erro ao contar detecções:", error)
    return 0
  }
}

// Verificar limite de sugestões de IA
export async function checkAISuggestionsLimit(userEmail: string): Promise<LimitCheckResult> {
  try {
    const hasLimit = await hasActiveLimit(userEmail)

    if (!hasLimit) {
      return {
        allowed: true,
        currentCount: 0,
        limit: -1,
        message: "Sem limite - conta premium",
      }
    }

    // Implementação similar às outras verificações
    const weekStart = getWeekStart()
    const currentCount = await getAISuggestionsCountFromLogs(userEmail, weekStart)

    const allowed = currentCount < WEEKLY_LIMITS.AI_SUGGESTIONS

    return {
      allowed,
      currentCount,
      limit: WEEKLY_LIMITS.AI_SUGGESTIONS,
      message: allowed
        ? `${currentCount}/${WEEKLY_LIMITS.AI_SUGGESTIONS} sugestões de IA esta semana`
        : `Limite semanal de ${WEEKLY_LIMITS.AI_SUGGESTIONS} sugestões atingido! Atual: ${currentCount}`,
    }
  } catch (error) {
    console.error("Erro ao verificar limite de sugestões:", error)
    return {
      allowed: false,
      currentCount: 0,
      limit: WEEKLY_LIMITS.AI_SUGGESTIONS,
      message: "Erro ao verificar limite",
    }
  }
}

// Função auxiliar para contar sugestões de IA
async function getAISuggestionsCountFromLogs(userEmail: string, weekStart: Date): Promise<number> {
  try {
    // Implementação simplificada - contar depósitos com sugestões geradas
    const weekEnd = getWeekEnd()
    const depositosWithSuggestions = await Deposito.countDocuments({
      userEmail: userEmail,
      createdAt: {
        $gte: weekStart,
        $lte: weekEnd,
      },
      "sugestoes_geradas.receitas.0": { $exists: true },
    })

    return depositosWithSuggestions * 3 // Estimativa: 3 sugestões por depósito
  } catch (error) {
    console.error("Erro ao contar sugestões de IA:", error)
    return 0
  }
}
