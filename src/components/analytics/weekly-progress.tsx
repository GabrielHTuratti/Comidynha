"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import type { IRefeicao } from "@/model/refeicao"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface WeeklyProgressProps {
  meals: IRefeicao[]
}

export function WeeklyProgress({ meals }: WeeklyProgressProps) {
  // Dados da semana atual vs semana anterior
  const currentWeekStart = new Date()
  currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay())

  const lastWeekStart = new Date(currentWeekStart)
  lastWeekStart.setDate(lastWeekStart.getDate() - 7)

  const currentWeekMeals = meals.filter((meal) => {
    const mealDate = new Date(meal.data)
    return mealDate >= currentWeekStart
  })

  const lastWeekMeals = meals.filter((meal) => {
    const mealDate = new Date(meal.data)
    return mealDate >= lastWeekStart && mealDate < currentWeekStart
  })

  // Calcular métricas semanais
  const currentWeekStats = {
    totalMeals: currentWeekMeals.length,
    totalCalories: currentWeekMeals.reduce((sum, meal) => sum + meal.calorias, 0),
    avgCaloriesPerMeal:
      currentWeekMeals.length > 0
        ? Math.round(currentWeekMeals.reduce((sum, meal) => sum + meal.calorias, 0) / currentWeekMeals.length)
        : 0,
    totalProteins: currentWeekMeals.reduce(
      (sum, meal) => sum + (Number.parseFloat(meal.desc.proteinas || "0") || 0),
      0,
    ),
    totalCarbs: currentWeekMeals.reduce(
      (sum, meal) => sum + (Number.parseFloat(meal.desc.carboidratos || "0") || 0),
      0,
    ),
    totalFats: currentWeekMeals.reduce((sum, meal) => sum + (Number.parseFloat(meal.desc.gorduras || "0") || 0), 0),
  }

  const lastWeekStats = {
    totalMeals: lastWeekMeals.length,
    totalCalories: lastWeekMeals.reduce((sum, meal) => sum + meal.calorias, 0),
    avgCaloriesPerMeal:
      lastWeekMeals.length > 0
        ? Math.round(lastWeekMeals.reduce((sum, meal) => sum + meal.calorias, 0) / lastWeekMeals.length)
        : 0,
    totalProteins: lastWeekMeals.reduce((sum, meal) => sum + (Number.parseFloat(meal.desc.proteinas || "0") || 0), 0),
    totalCarbs: lastWeekMeals.reduce((sum, meal) => sum + (Number.parseFloat(meal.desc.carboidratos || "0") || 0), 0),
    totalFats: lastWeekMeals.reduce((sum, meal) => sum + (Number.parseFloat(meal.desc.gorduras || "0") || 0), 0),
  }

  // Calcular variações percentuais
  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0
    return Math.round(((current - previous) / previous) * 100)
  }

  const changes = {
    meals: calculateChange(currentWeekStats.totalMeals, lastWeekStats.totalMeals),
    calories: calculateChange(currentWeekStats.totalCalories, lastWeekStats.totalCalories),
    avgCalories: calculateChange(currentWeekStats.avgCaloriesPerMeal, lastWeekStats.avgCaloriesPerMeal),
    proteins: calculateChange(currentWeekStats.totalProteins, lastWeekStats.totalProteins),
    carbs: calculateChange(currentWeekStats.totalCarbs, lastWeekStats.totalCarbs),
    fats: calculateChange(currentWeekStats.totalFats, lastWeekStats.totalFats),
  }

  // Dados para gráfico de barras comparativo
  const comparisonData = [
    {
      metric: "Refeições",
      atual: currentWeekStats.totalMeals,
      anterior: lastWeekStats.totalMeals,
    },
    {
      metric: "Calorias",
      atual: Math.round(currentWeekStats.totalCalories / 100), // Dividido por 100 para melhor visualização
      anterior: Math.round(lastWeekStats.totalCalories / 100),
    },
    {
      metric: "Proteínas",
      atual: Math.round(currentWeekStats.totalProteins),
      anterior: Math.round(lastWeekStats.totalProteins),
    },
    {
      metric: "Carboidratos",
      atual: Math.round(currentWeekStats.totalCarbs),
      anterior: Math.round(lastWeekStats.totalCarbs),
    },
    {
      metric: "Gorduras",
      atual: Math.round(currentWeekStats.totalFats),
      anterior: Math.round(lastWeekStats.totalFats),
    },
  ]

  // Dados para gráfico radar (qualidade nutricional)
  const radarData = [
    {
      subject: "Consistência",
      A: Math.min(100, (currentWeekStats.totalMeals / 21) * 100), // 3 refeições por dia = 21 por semana
      fullMark: 100,
    },
    {
      subject: "Proteínas",
      A: Math.min(100, (currentWeekStats.totalProteins / 1050) * 100), // Meta: 150g/dia * 7 dias
      fullMark: 100,
    },
    {
      subject: "Carboidratos",
      A: Math.min(100, (currentWeekStats.totalCarbs / 1750) * 100), // Meta: 250g/dia * 7 dias
      fullMark: 100,
    },
    {
      subject: "Gorduras",
      A: Math.min(100, (currentWeekStats.totalFats / 455) * 100), // Meta: 65g/dia * 7 dias
      fullMark: 100,
    },
    {
      subject: "Calorias",
      A: Math.min(100, (currentWeekStats.totalCalories / 14000) * 100), // Meta: 2000 kcal/dia * 7 dias
      fullMark: 100,
    },
  ]

  // Função para renderizar ícone de tendência
  const renderTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-500" />
    return <Minus className="h-4 w-4 text-gray-500" />
  }

  // Função para renderizar cor da variação
  const getTrendColor = (change: number) => {
    if (change > 0) return "text-green-600"
    if (change < 0) return "text-red-600"
    return "text-gray-600"
  }

  return (
    <div className="space-y-6">
      {/* Cards de Métricas Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Refeições</CardTitle>
            {renderTrendIcon(changes.meals)}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentWeekStats.totalMeals}</div>
            <p className={`text-xs ${getTrendColor(changes.meals)}`}>
              {changes.meals > 0 ? "+" : ""}
              {changes.meals}% vs semana anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Calorias</CardTitle>
            {renderTrendIcon(changes.calories)}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentWeekStats.totalCalories.toLocaleString()}</div>
            <p className={`text-xs ${getTrendColor(changes.calories)}`}>
              {changes.calories > 0 ? "+" : ""}
              {changes.calories}% vs semana anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média por Refeição</CardTitle>
            {renderTrendIcon(changes.avgCalories)}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentWeekStats.avgCaloriesPerMeal}</div>
            <p className={`text-xs ${getTrendColor(changes.avgCalories)}`}>
              {changes.avgCalories > 0 ? "+" : ""}
              {changes.avgCalories}% vs semana anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score Nutricional</CardTitle>
            <Badge variant="secondary">
              {Math.round(radarData.reduce((sum, item) => sum + item.A, 0) / radarData.length)}%
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(radarData.reduce((sum, item) => sum + item.A, 0) / radarData.length)}/100
            </div>
            <p className="text-xs text-muted-foreground">Baseado nas metas semanais</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-1">
        {/* Gráfico de Comparação Semanal */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Comparação Semanal</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="2 2" />
                <XAxis dataKey="metric" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="anterior" fill="#e2e8f0" name="Semana Anterior" />
                <Bar dataKey="atual" fill="#3b82f6" name="Semana Atual" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Progresso das Metas Semanais */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Progresso das Metas Semanais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Refeições (Meta: 21)</span>
                <span>{currentWeekStats.totalMeals}/21</span>
              </div>
              <Progress value={(currentWeekStats.totalMeals / 21) * 100} />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Calorias (Meta: 14.000)</span>
                <span>{currentWeekStats.totalCalories.toLocaleString()}/14.000</span>
              </div>
              <Progress value={(currentWeekStats.totalCalories / 14000) * 100} />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Proteínas (Meta: 1.050g)</span>
                <span>{Math.round(currentWeekStats.totalProteins)}g/1.050g</span>
              </div>
              <Progress value={(currentWeekStats.totalProteins / 1050) * 100} />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Carboidratos (Meta: 1.750g)</span>
                <span>{Math.round(currentWeekStats.totalCarbs)}g/1.750g</span>
              </div>
              <Progress value={(currentWeekStats.totalCarbs / 1750) * 100} />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Gorduras (Meta: 455g)</span>
                <span>{Math.round(currentWeekStats.totalFats)}g/455g</span>
              </div>
              <Progress value={(currentWeekStats.totalFats / 455) * 100} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
