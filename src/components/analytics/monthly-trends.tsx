"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { IRefeicao } from "@/model/refeicao"
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
} from "recharts"
import { Calendar, TrendingUp, Activity, Clock } from "lucide-react"

interface MonthlyTrendsProps {
  meals: IRefeicao[]
}

export function MonthlyTrends({ meals }: MonthlyTrendsProps) {
  // Gerar dados dos últimos 30 dias
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date
  }).reverse()

  const dailyData = last30Days.map((date) => {
    const dayMeals = meals.filter((meal) => {
      const mealDate = new Date(meal.data)
      return mealDate.toDateString() === date.toDateString()
    })

    const totalCalories = dayMeals.reduce((sum, meal) => sum + meal.calorias, 0)
    const totalProteins = dayMeals.reduce((sum, meal) => sum + (Number.parseFloat(meal.desc.proteinas || "0") || 0), 0)
    const totalCarbs = dayMeals.reduce((sum, meal) => sum + (Number.parseFloat(meal.desc.carboidratos || "0") || 0), 0)
    const totalFats = dayMeals.reduce((sum, meal) => sum + (Number.parseFloat(meal.desc.gorduras || "0") || 0), 0)

    return {
      date: date.getDate(),
      fullDate: date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      calorias: totalCalories,
      proteinas: Math.round(totalProteins),
      carboidratos: Math.round(totalCarbs),
      gorduras: Math.round(totalFats),
      refeicoes: dayMeals.length,
      // Calcular média móvel de 7 dias para suavizar a linha
      mediaMovel: 0,
    }
  })

  // Calcular média móvel de 7 dias
  dailyData.forEach((day, index) => {
    const start = Math.max(0, index - 3)
    const end = Math.min(dailyData.length, index + 4)
    const window = dailyData.slice(start, end)
    day.mediaMovel = Math.round(window.reduce((sum, d) => sum + d.calorias, 0) / window.length)
  })

  // Análise por semanas do mês
  const weeklyData = []
  for (let week = 0; week < 4; week++) {
    const weekStart = week * 7
    const weekEnd = Math.min((week + 1) * 7, dailyData.length)
    const weekDays = dailyData.slice(weekStart, weekEnd)

    if (weekDays.length > 0) {
      const avgCalories = Math.round(weekDays.reduce((sum, day) => sum + day.calorias, 0) / weekDays.length)
      const avgMeals = Math.round((weekDays.reduce((sum, day) => sum + day.refeicoes, 0) / weekDays.length) * 10) / 10
      const totalDays = weekDays.filter((day) => day.refeicoes > 0).length

      weeklyData.push({
        semana: `Sem ${week + 1}`,
        mediaCalorias: avgCalories,
        mediaRefeicoes: avgMeals,
        diasAtivos: totalDays,
        consistencia: Math.round((totalDays / weekDays.length) * 100),
      })
    }
  }

  // Análise de padrões por dia da semana
  const weekdayPatterns = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day, index) => {
    const dayMeals = meals.filter((meal) => {
      const mealDate = new Date(meal.data)
      return mealDate.getDay() === index
    })

    const avgCalories =
      dayMeals.length > 0 ? Math.round(dayMeals.reduce((sum, meal) => sum + meal.calorias, 0) / dayMeals.length) : 0

    const mealCount = dayMeals.length
    const avgMealsPerDay = mealCount > 0 ? Math.round((mealCount / 4) * 10) / 10 : 0 // Assumindo 4 semanas

    return {
      dia: day,
      mediaCalorias: avgCalories,
      mediaRefeicoes: avgMealsPerDay,
      total: mealCount,
    }
  })

  // Análise de horários das refeições
  const hourlyPatterns = Array.from({ length: 24 }, (_, hour) => {
    const hourMeals = meals.filter((meal) => {
      const mealDate = new Date(meal.data)
      return mealDate.getHours() === hour
    })

    return {
      hora: `${hour.toString().padStart(2, "0")}h`,
      refeicoes: hourMeals.length,
      mediaCalorias:
        hourMeals.length > 0
          ? Math.round(hourMeals.reduce((sum, meal) => sum + meal.calorias, 0) / hourMeals.length)
          : 0,
    }
  }).filter((hour) => hour.refeicoes > 0)

  // Estatísticas do mês
  const monthStats = {
    totalDays: dailyData.filter((day) => day.refeicoes > 0).length,
    avgCaloriesPerDay: Math.round(dailyData.reduce((sum, day) => sum + day.calorias, 0) / 30),
    maxCaloriesDay: Math.max(...dailyData.map((day) => day.calorias)),
    minCaloriesDay: Math.min(...dailyData.filter((day) => day.calorias > 0).map((day) => day.calorias)),
    totalMeals: dailyData.reduce((sum, day) => sum + day.refeicoes, 0),
    consistency: Math.round((dailyData.filter((day) => day.refeicoes > 0).length / 30) * 100),
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas do Mês */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dias Ativos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthStats.totalDays}</div>
            <p className="text-xs text-muted-foreground">{monthStats.consistency}% de consistência</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média Diária</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthStats.avgCaloriesPerDay}</div>
            <p className="text-xs text-muted-foreground">kcal por dia</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Refeições</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthStats.totalMeals}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((monthStats.totalMeals / 30) * 10) / 10} por dia
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Variação</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{monthStats.maxCaloriesDay - monthStats.minCaloriesDay}</div>
            <p className="text-xs text-muted-foreground">
              Max: {monthStats.maxCaloriesDay} | Min: {monthStats.minCaloriesDay}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Tendência Mensal com Média Móvel */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Tendência Mensal - Calorias e Média Móvel</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fullDate" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="calorias" fill="#3b82f6" fillOpacity={0.1} stroke="none" />
                <Line type="monotone" dataKey="calorias" stroke="#3b82f6" strokeWidth={1} dot={false} />
                <Line type="monotone" dataKey="mediaMovel" stroke="#ef4444" strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#3b82f6]" />
                <span className="text-sm">Calorias Diárias</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
                <span className="text-sm">Média Móvel (7 dias)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Análise Semanal */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Progresso Semanal</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="semana" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="mediaCalorias" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {weeklyData.map((week, index) => (
                <div key={index} className="text-center">
                  <Badge variant="outline">{week.consistencia}% consistência</Badge>
                  <p className="text-xs text-muted-foreground mt-1">{week.semana}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Padrões por Dia da Semana */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Padrões por Dia da Semana</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weekdayPatterns}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dia" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="mediaCalorias" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-4 gap-2 mt-4">
              {weekdayPatterns.slice(0, 4).map((day, index) => (
                <div key={index} className="text-center">
                  <Badge variant="secondary" className="text-xs">
                    {day.mediaRefeicoes} ref/dia
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">{day.dia}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Análise de Horários */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Padrões de Horários das Refeições</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={hourlyPatterns}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hora" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="refeicoes" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {hourlyPatterns.slice(0, 6).map((hour, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {hour.hora}: {hour.refeicoes} refeições
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
