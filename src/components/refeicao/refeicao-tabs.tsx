"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Utensils } from "lucide-react"
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
      <TabsList className="mb-3 xs:mb-4 grid w-full grid-cols-5 h-auto p-1">
        <TabsTrigger value="todos" className="text-xs xs:text-sm py-2 px-1 xs:px-2">
          <span className="hidden xs:inline">Todos</span>
          <span className="xs:hidden">All</span>
        </TabsTrigger>
        <TabsTrigger value="cafe-da-manha" className="text-xs xs:text-sm py-2 px-1 xs:px-2">
          <span className="hidden sm:inline">Café da manhã</span>
          <span className="sm:hidden">Café</span>
        </TabsTrigger>
        <TabsTrigger value="almoco" className="text-xs xs:text-sm py-2 px-1 xs:px-2">
          Almoço
        </TabsTrigger>
        <TabsTrigger value="lanche-da-tarde" className="text-xs xs:text-sm py-2 px-1 xs:px-2">
          <span className="hidden xs:inline">Lanche</span>
          <span className="xs:hidden">Lanche-da-tarde</span>
        </TabsTrigger>
        <TabsTrigger value="janta" className="text-xs xs:text-sm py-2 px-1 xs:px-2">
          Janta
        </TabsTrigger>
      </TabsList>

      <TabsContent value="todos" className="space-y-3 xs:space-y-4">
        <h2 className="text-lg xs:text-xl font-semibold">Todas as Refeições</h2>
        {filteredMeals.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8 xs:py-10 px-4">
              <Utensils className="h-8 w-8 xs:h-10 xs:w-10 text-muted-foreground mb-3 xs:mb-4" />
              <p className="text-muted-foreground text-center text-sm xs:text-base mb-3 xs:mb-4">
                Nenhuma refeição encontrada.
              </p>
              <Button variant="outline" onClick={() => onAddMeal()} className="w-full xs:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Refeição
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3 xs:space-y-4">
            <div className="grid gap-3 xs:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredMeals.map((meal) => (
                <MealCard key={meal.refid} meal={meal} onEdit={onEdit} onDelete={onDelete} />
              ))}
            </div>
            <div className="flex justify-center pt-2">
              <Button variant="outline" onClick={() => onAddMeal()} className="w-full xs:w-auto max-w-xs" size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Nova Refeição
              </Button>
            </div>
          </div>
        )}
      </TabsContent>

      {["cafe-da-manha", "almoco", "lanche-da-tarde", "janta"].map((type) => (
        <TabsContent key={type} value={type} className="space-y-3 xs:space-y-4">
          <h2 className="text-lg xs:text-xl font-semibold">{getMealTypeName(type as RefeicaoTipo)}</h2>
          {filteredMeals.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 xs:py-10 px-4">
                <div className="mb-3 xs:mb-4">{getMealTypeIcon(type as RefeicaoTipo)}</div>
                <p className="text-muted-foreground text-center text-sm xs:text-base mb-3 xs:mb-4">
                  Nenhuma refeição do tipo {getMealTypeName(type as RefeicaoTipo)} encontrada.
                </p>
                <Button variant="outline" onClick={() => onAddMeal(type as RefeicaoTipo)} className="w-full xs:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar {getMealTypeName(type as RefeicaoTipo)}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3 xs:space-y-4">
              <div className="grid gap-3 xs:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {filteredMeals.map((meal) => (
                  <MealCard key={meal.refid} meal={meal} onEdit={onEdit} onDelete={onDelete} />
                ))}
              </div>
              <div className="flex justify-center pt-2">
                <Button
                  variant="outline"
                  onClick={() => onAddMeal(type as RefeicaoTipo)}
                  className="w-full xs:w-auto max-w-xs"
                  size="lg"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar {getMealTypeName(type as RefeicaoTipo)}
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      ))}
    </Tabs>
  )
}
