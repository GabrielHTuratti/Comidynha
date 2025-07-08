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
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts"

interface NutritionAnalyticsProps {
  meals: IRefeicao[]
}

export function NutritionAnalytics({ meals }: NutritionAnalyticsProps) {
  // Calcular dados dos últimos 7 dias
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date.toISOString().split("T")[0]
  }).reverse()

  const dailyNutrition = last7Days.map((date) => {
    const dayMeals = meals.filter((meal) => new Date(meal.data).toISOString().split("T")[0] === date)

    const totalProteins = dayMeals.reduce((sum, meal) => sum + (Number.parseFloat(meal.desc.proteinas || "0") || 0), 0)
    const totalCarbs = dayMeals.reduce((sum, meal) => sum + (Number.parseFloat(meal.desc.carboidratos || "0") || 0), 0)
    const totalFats = dayMeals.reduce((sum, meal) => sum + (Number.parseFloat(meal.desc.gorduras || "0") || 0), 0)
    const totalCalories = dayMeals.reduce((sum, meal) => sum + meal.calorias, 0)

    return {
      date: new Date(date).toLocaleDateString("pt-BR", { weekday: "short" }),
      proteinas: Math.round(totalProteins),
      carboidratos: Math.round(totalCarbs),
      gorduras: Math.round(totalFats),
      calorias: totalCalories,
    }
  })

  // Distribuição de macronutrientes (média dos últimos 7 dias)
  const avgProteins = dailyNutrition.reduce((sum, day) => sum + day.proteinas, 0) 
  const avgCarbs = dailyNutrition.reduce((sum, day) => sum + day.carboidratos, 0) 
  const avgFats = dailyNutrition.reduce((sum, day) => sum + day.gorduras, 0)

  const macroDistribution = [
    { name: "Proteínas", value: Math.round(avgProteins), color: "#8884d8", percentage: 0 },
    { name: "Carboidratos", value: Math.round(avgCarbs), color: "#82ca9d", percentage: 0 },
    { name: "Gorduras", value: Math.round(avgFats), color: "#ffc658", percentage: 0 },
  ]

  const totalMacros = macroDistribution.reduce((sum, macro) => sum + macro.value, 0)
  macroDistribution.forEach((macro) => {
    macro.percentage = totalMacros > 0 ? Math.round((macro.value / totalMacros) * 100) : 0
  })


  const mealTypeAnalysis = ["cafe-da-manha", "almoco", "lanche-da-tarde", "janta"].map((tipo) => {
    const typeMeals = meals.filter((meal) => meal.tipo === tipo)
    const avgCalories =
      typeMeals.length > 0 ? Math.round(typeMeals.reduce((sum, meal) => sum + meal.calorias, 0) / typeMeals.length) : 0

    const typeNames = {
      "cafe-da-manha": "Café da Manhã",
      almoco: "Almoço",
      "lanche-da-tarde": "Lanche",
      janta: "Janta",
    }

    return {
      tipo: typeNames[tipo as keyof typeof typeNames],
      media: avgCalories,
      total: typeMeals.length,
    }
  })

  // Metas nutricionais (valores exemplo - podem vir do perfil do usuário)
  const nutritionGoals = {
    calorias: 2000,
    proteinas: 150,
    carboidratos: 250,
    gorduras: 65,
  }

  const todayNutrition = dailyNutrition[dailyNutrition.length - 1] || {
    proteinas: 0,
    carboidratos: 0,
    gorduras: 0,
    calorias: 0,
  }

  return (
    <div className="space-y-6">
      {/* Progresso das Metas Diárias */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Calorias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayNutrition.calorias}</div>
            <Progress value={(todayNutrition.calorias / nutritionGoals.calorias) * 100} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">Meta: {nutritionGoals.calorias} kcal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Proteínas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayNutrition.proteinas}g</div>
            <Progress value={(todayNutrition.proteinas / nutritionGoals.proteinas) * 100} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">Meta: {nutritionGoals.proteinas}g</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Carboidratos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayNutrition.carboidratos}g</div>
            <Progress value={(todayNutrition.carboidratos / nutritionGoals.carboidratos) * 100} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">Meta: {nutritionGoals.carboidratos}g</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Gorduras</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayNutrition.gorduras}g</div>
            <Progress value={(todayNutrition.gorduras / nutritionGoals.gorduras) * 100} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">Meta: {nutritionGoals.gorduras}g</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Gráfico de Tendência Semanal */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tendência Semanal - Calorias</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={dailyNutrition}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="calorias" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribuição de Macronutrientes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Distribuição de Macronutrientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={macroDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {macroDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}g`, ""]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {macroDistribution.map((macro, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: macro.color }} />
                  <span className="text-sm">
                    {macro.name}: {macro.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Análise por Tipo de Refeição */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Análise por Tipo de Refeição</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mealTypeAnalysis}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tipo" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="media" fill="#82ca9d" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-4 gap-4 mt-4">
            {mealTypeAnalysis.map((meal, index) => (
              <div key={index} className="text-center">
                <Badge variant="outline" className="mb-1">
                  {meal.total} refeições
                </Badge>
                <p className="text-xs text-muted-foreground">{meal.tipo}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Macronutrientes ao Longo da Semana */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Macronutrientes - Últimos 7 Dias</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyNutrition}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="proteinas" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="carboidratos" stroke="#82ca9d" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="gorduras" stroke="#ffc658" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#8884d8]" />
              <span className="text-sm">Proteínas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#82ca9d]" />
              <span className="text-sm">Carboidratos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ffc658]" />
              <span className="text-sm">Gorduras</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
