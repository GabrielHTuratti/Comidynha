"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { IRefeicao } from "@/model/refeicao"
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
} from "recharts"
import { Award, TrendingUp, Settings, CheckCircle } from "lucide-react"
import { useState } from "react"

interface GoalsTrackingProps {
  meals: IRefeicao[]
  userPlan: string
}

export function GoalsTracking({ meals, userPlan }: GoalsTrackingProps) {
  const [selectedGoal, setSelectedGoal] = useState<string>("daily")

  // Metas baseadas no plano do usuário
  const planGoals = {
    Basico: {
      dailyCalories: 2000,
      dailyMeals: 3,
      weeklyMeals: 21,
      monthlyMeals: 90,
      dailyProteins: 100,
      dailyCarbs: 200,
      dailyFats: 50,
    },
    Essencial: {
      dailyCalories: 2200,
      dailyMeals: 4,
      weeklyMeals: 28,
      monthlyMeals: 120,
      dailyProteins: 120,
      dailyCarbs: 220,
      dailyFats: 60,
    },
    Avancado: {
      dailyCalories: 2400,
      dailyMeals: 5,
      weeklyMeals: 35,
      monthlyMeals: 150,
      dailyProteins: 150,
      dailyCarbs: 250,
      dailyFats: 70,
    },
  }

  const goals = planGoals[userPlan as keyof typeof planGoals] || planGoals.Basico

  // Calcular dados de hoje
  const today = new Date()
  const todayMeals = meals.filter((meal) => {
    const mealDate = new Date(meal.data)
    return mealDate.toDateString() === today.toDateString()
  })

  const todayStats = {
    calories: todayMeals.reduce((sum, meal) => sum + meal.calorias, 0),
    meals: todayMeals.length,
    proteins: todayMeals.reduce((sum, meal) => sum + (Number.parseFloat(meal.desc.proteinas || "0") || 0), 0),
    carbs: todayMeals.reduce((sum, meal) => sum + (Number.parseFloat(meal.desc.carboidratos || "0") || 0), 0),
    fats: todayMeals.reduce((sum, meal) => sum + (Number.parseFloat(meal.desc.gorduras || "0") || 0), 0),
  }

  // Calcular dados da semana
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay())

  const weekMeals = meals.filter((meal) => {
    const mealDate = new Date(meal.data)
    return mealDate >= weekStart
  })

  // Calcular dados do mês
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
  const monthMeals = meals.filter((meal) => {
    const mealDate = new Date(meal.data)
    return mealDate >= monthStart
  })

  // Dados para gráfico radial das metas diárias
  const dailyGoalsData = [
    {
      name: "Calorias",
      value: Math.min(100, (todayStats.calories / goals.dailyCalories) * 100),
      fill: "#8884d8",
    },
    {
      name: "Refeições",
      value: Math.min(100, (todayStats.meals / goals.dailyMeals) * 100),
      fill: "#82ca9d",
    },
    {
      name: "Proteínas",
      value: Math.min(100, (todayStats.proteins / goals.dailyProteins) * 100),
      fill: "#ffc658",
    },
    {
      name: "Carboidratos",
      value: Math.min(100, (todayStats.carbs / goals.dailyCarbs) * 100),
      fill: "#ff7c7c",
    },
    {
      name: "Gorduras",
      value: Math.min(100, (todayStats.fats / goals.dailyFats) * 100),
      fill: "#8dd1e1",
    },
  ]

  // Progresso dos últimos 7 dias para metas diárias
  const last7DaysProgress = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)

    const dayMeals = meals.filter((meal) => {
      const mealDate = new Date(meal.data)
      return mealDate.toDateString() === date.toDateString()
    })

    const dayCalories = dayMeals.reduce((sum, meal) => sum + meal.calorias, 0)
    const dayMealsCount = dayMeals.length

    return {
      date: date.toLocaleDateString("pt-BR", { weekday: "short" }),
      caloriesProgress: Math.min(100, (dayCalories / goals.dailyCalories) * 100),
      mealsProgress: Math.min(100, (dayMealsCount / goals.dailyMeals) * 100),
      calories: dayCalories,
      mealsCount: dayMealsCount,
    }
  }).reverse()

  // Conquistas e badges
  const achievements = [
    {
      id: "streak_7",
      name: "Sequência de 7 dias",
      description: "Registrou refeições por 7 dias consecutivos",
      achieved: false, // Calcular baseado nos dados
      icon: "🔥",
      points: 100,
    },
    {
      id: "goal_daily",
      name: "Meta Diária",
      description: "Atingiu a meta de calorias diárias",
      achieved: todayStats.calories >= goals.dailyCalories * 0.9,
      icon: "🎯",
      points: 50,
    },
    {
      id: "consistent_week",
      name: "Semana Consistente",
      description: "Registrou pelo menos 3 refeições por dia na semana",
      achieved: weekMeals.length >= goals.weeklyMeals * 0.8,
      icon: "📅",
      points: 200,
    },
    {
      id: "protein_goal",
      name: "Proteína em Dia",
      description: "Atingiu a meta de proteínas",
      achieved: todayStats.proteins >= goals.dailyProteins * 0.9,
      icon: "💪",
      points: 75,
    },
  ]

  const totalPoints = achievements
    .filter((achievement) => achievement.achieved)
    .reduce((sum, achievement) => sum + achievement.points, 0)

  // Metas personalizadas (exemplo - podem vir do banco de dados)
  const customGoals = [
    {
      id: "weight_loss",
      name: "Perda de Peso",
      target: "Déficit de 500 kcal/dia",
      progress: Math.max(0, Math.min(100, ((2000 - todayStats.calories) / 500) * 100)),
      type: "daily",
    },
    {
      id: "muscle_gain",
      name: "Ganho de Massa",
      target: "2g proteína/kg peso",
      progress: Math.min(100, (todayStats.proteins / 140) * 100), // Assumindo 70kg
      type: "daily",
    },
    {
      id: "hydration",
      name: "Hidratação",
      target: "8 copos de água/dia",
      progress: 60, // Exemplo - seria calculado baseado em dados
      type: "daily",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Seletor de Período */}
      <div className="flex gap-2">
        <Button
          variant={selectedGoal === "daily" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedGoal("daily")}
        >
          Diário
        </Button>
        <Button
          variant={selectedGoal === "weekly" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedGoal("weekly")}
        >
          Semanal
        </Button>
        <Button
          variant={selectedGoal === "monthly" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedGoal("monthly")}
        >
          Mensal
        </Button>
      </div>

      {/* Resumo de Pontos e Nível */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pontos Totais</CardTitle>
            <Award className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPoints}</div>
            <p className="text-xs text-muted-foreground">{achievements.filter((a) => a.achieved).length} conquistas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nível Atual</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.floor(totalPoints / 100) + 1}</div>
            <Progress value={totalPoints % 100} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">{100 - (totalPoints % 100)} pontos para próximo nível</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plano</CardTitle>
            <Settings className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{userPlan}</div>
            <Badge variant="secondary" className="mt-1">
              Metas Personalizadas
            </Badge>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Gráfico Radial das Metas Diárias */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Progresso das Metas Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <RadialBarChart data={dailyGoalsData} innerRadius="20%" outerRadius="80%">
                <RadialBar dataKey="value" cornerRadius={10} fill="#8884d8" />
                <Tooltip />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {dailyGoalsData.map((goal, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: goal.fill }} />
                  <span className="text-xs">
                    {goal.name}: {Math.round(goal.value)}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Progresso dos Últimos 7 Dias */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Consistência Semanal</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={last7DaysProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="caloriesProgress" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                <Line type="monotone" dataKey="mealsProgress" stroke="#82ca9d" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Metas Personalizadas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Metas Personalizadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {customGoals.map((goal, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{goal.name}</h4>
                    <p className="text-sm text-muted-foreground">{goal.target}</p>
                  </div>
                  <Badge variant={goal.progress >= 100 ? "default" : "secondary"}>{Math.round(goal.progress)}%</Badge>
                </div>
                <Progress value={goal.progress} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Conquistas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Conquistas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  achievement.achieved ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{achievement.name}</h4>
                      {achievement.achieved && <CheckCircle className="h-4 w-4 text-green-500" />}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                    <Badge variant={achievement.achieved ? "default" : "secondary"}>{achievement.points} pontos</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Progresso Detalhado por Período */}
      {selectedGoal === "weekly" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Progresso Semanal Detalhado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Refeições da Semana</span>
                  <span>
                    {weekMeals.length}/{goals.weeklyMeals}
                  </span>
                </div>
                <Progress value={(weekMeals.length / goals.weeklyMeals) * 100} />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Média de Calorias/Dia</span>
                  <span>
                    {Math.round(weekMeals.reduce((sum, meal) => sum + meal.calorias, 0) / 7)}/{goals.dailyCalories}
                  </span>
                </div>
                <Progress
                  value={(weekMeals.reduce((sum, meal) => sum + meal.calorias, 0) / 7 / goals.dailyCalories) * 100}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedGoal === "monthly" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Progresso Mensal Detalhado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Refeições do Mês</span>
                  <span>
                    {monthMeals.length}/{goals.monthlyMeals}
                  </span>
                </div>
                <Progress value={(monthMeals.length / goals.monthlyMeals) * 100} />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Dias Ativos</span>
                  <span>{new Set(monthMeals.map((meal) => new Date(meal.data).toDateString())).size}/30</span>
                </div>
                <Progress
                  value={(new Set(monthMeals.map((meal) => new Date(meal.data).toDateString())).size / 30) * 100}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
