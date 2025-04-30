"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Flame } from "lucide-react"
import type { IRefeicao } from "@/model/refeicao"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Pie, Cell, PieChart } from 'recharts'
import refeicao from "@/model/refeicao"

interface MealStatsProps {
  meals: IRefeicao[]
}

export function MealStats({ meals }: MealStatsProps) {
  const totalcalorias = meals.reduce((total, meal) => {
    return total + meal.calorias
  }, 0)

  const mealTypes = ['cafe-da-manha', 'almoco', 'lanche-da-tarde', 'janta']


  const caloriesByTypes = mealTypes.map(type => ({
    name: type,
    calorias: meals.filter(meal => meal.tipo === type).reduce((sum, meal) => sum + meal.calorias, 0)
  }))

  const macrosData = [
    { name: 'Proteínas', value: meals.reduce((sum, meal) => sum + Number(meal.desc.proteinas), 0), color: '#8884d8' },
    { name: 'Carboidratos', value: meals.reduce((sum, meal) => sum + Number(meal.desc.carboidratos), 0), color: '#82ca9d' },
    { name: 'Gorduras', value: meals.reduce((sum, meal) => sum + Number(meal.desc.gorduras), 0), color: '#ffc658' }
  ]

  const mealsByHour = Array.from({length: 24}, (_, i) => {
    const hour = i.toString().padStart(2, '0')
    return {
      hora: `${hour}h`,
      refeicoes: meals.filter(meal => {
        const mealHour = new Date(meal.data || '').getHours();
        return mealHour === i
      }).length
    }
  })

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="h-[180px]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-0">
          <CardTitle className="text-sm font-medium">Total de Calorias Hoje</CardTitle>
          <Flame className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent className="p-3 pt-1">
          <div className="text-2xl font-bold">{totalcalorias} kcal</div>
          <p className="text-xs text-muted-foreground">
            {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </CardContent>
      </Card>

      <Card className="h-[180px]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Refeições Hoje</CardTitle>
          <Flame className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{meals.length} Refeições </div>
          <p className="text-xs text-muted-foreground">
            {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </CardContent>
      </Card>

      <Card className="col-span-2 h-[180px]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Calorias por Tipo de Refeição</CardTitle>
          <PieChart className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent className="p-3 pt-1 h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={caloriesByTypes} 
              margin={{
                top: 5,
                right: 10,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => value.split(' ').map((word: string)=> word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                width={30}
              />
              <Tooltip 
                contentStyle={{
                  fontSize: 12,
                  borderRadius: '6px',
                  padding: '4px 8px'
                }}
              />
              <Bar 
                dataKey="calorias" 
                fill="#8884d8" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-2 h-[300px]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Distribuição de Macronutrientes</CardTitle>
          <PieChart className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent className="p-3 pt-1 h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={macrosData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {macrosData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-2 h-[220px]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Refeições por Hora do Dia</CardTitle>
          <Clock className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent className="p-3 pt-1 h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mealsByHour}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hora" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="refeicoes" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    
    </div>
  )
}
