"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Utensils } from "lucide-react"
import { MealCard } from "./refeicao-card"
import { getMealTypeIcon, getMealTypeName } from "@/lib/utils-refeicao"
import type { IRefeicao, RefeicaoTipo } from "@/model/refeicao"

interface MealTabsProps {
  meals: IRefeicao[]
  onEdit: (meal: IRefeicao) => void
  onDelete: (id: string) => void
  onAddMeal: (type?: RefeicaoTipo) => void
}

export function MealTabs({ meals, onEdit, onDelete, onAddMeal }: MealTabsProps) {
  const [currentFilter, setCurrentFilter] = useState<RefeicaoTipo | "todos">("todos")

  const filteredMeals = currentFilter === "todos" ? meals : meals.filter((meal) => meal.tipo === currentFilter)

  return (
    <Tabs
      defaultValue="todos"
      className="w-full"
      onValueChange={(value) => setCurrentFilter(value as RefeicaoTipo | "todos")}
    >
      <TabsList className="mb-4">
        <TabsTrigger value="todos">Todos</TabsTrigger>
        <TabsTrigger value="cafe-da-manha">Café da manhã</TabsTrigger>
        <TabsTrigger value="almoco">Almoço</TabsTrigger>
        <TabsTrigger value="lanche-da-tarde">Lanche</TabsTrigger>
        <TabsTrigger value="janta">Janta</TabsTrigger>
      </TabsList>
      <TabsContent value="todos" className="space-y-4">
        <h2 className="text-xl font-semibold">Todas as Refeições</h2>
        {filteredMeals.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <Utensils className="h-10 w-10 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">Nenhuma refeição encontrada.</p>
              <Button variant="outline" className="mt-4" onClick={() => onAddMeal()}>
                Adicionar Refeição
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredMeals.map((meal) => (
              <MealCard key={meal.refid} meal={meal} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </div>
        )}
      </TabsContent>
      {["cafe-da-manha", "almoco", "lanche-da-tarde", "janta"].map((type) => (
        <TabsContent key={type} value={type} className="space-y-4">
          <h2 className="text-xl font-semibold">{getMealTypeName(type as RefeicaoTipo)}</h2>
          {filteredMeals.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                {getMealTypeIcon(type as RefeicaoTipo)}
                <p className="text-muted-foreground text-center mt-4">
                  Nenhuma refeição do tipo {getMealTypeName(type as RefeicaoTipo)} encontrada.
                </p>
                <Button variant="outline" className="mt-4" onClick={() => onAddMeal(type as RefeicaoTipo)}>
                  Adicionar {getMealTypeName(type as RefeicaoTipo)}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredMeals.map((meal) => (
                <MealCard key={meal.refid} meal={meal} onEdit={onEdit} onDelete={onDelete} />
              ))}
            </div>
          )}
        </TabsContent>
      ))}
    </Tabs>
  )
}
