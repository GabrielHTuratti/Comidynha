"use client"

import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Flame, Edit, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getMealTypeIcon, getMealTypeName } from "@/lib/utils-refeicao"
import type { IRefeicao } from "@/model/refeicao"

interface MealCardProps {
  meal: IRefeicao
  onEdit: (meal: IRefeicao) => void
  onDelete: (id: string) => void
}

export function MealCard({ meal, onEdit, onDelete }: MealCardProps) {
  const mealDate = new Date(meal.data)
  const formattedDate = format(mealDate, "dd 'de' MMMM", { locale: ptBR })
  const formattedTime = format(mealDate, "HH:mm")

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-emerald-100 p-1 dark:bg-emerald-900">{getMealTypeIcon(meal.tipo)}</div>
            <CardTitle>{meal.nome}</CardTitle>
          </div>
          <Badge variant="outline" className="ml-2">
            {getMealTypeName(meal.tipo)}
          </Badge>
        </div>
        {meal.desc && Object.keys(meal.desc).length > 0 && (
          <>
            {meal.desc.carboidratos !== undefined && (
              <CardDescription>Carboidratos: {meal.desc.carboidratos}g</CardDescription>
            )}
            {meal.desc.proteinas !== undefined && <CardDescription>Proteínas: {meal.desc.proteinas}g</CardDescription>}
            {meal.desc.gorduras !== undefined && <CardDescription>Gorduras: {meal.desc.gorduras}g</CardDescription>}
            {meal.desc.extra && typeof meal.desc.extra === "object" && (
              <>
                {meal.desc.extra?.map((campo) => (
                  <CardDescription key={`extra-${campo.campoid}`}>
                    {campo.nome}: {campo.valor}
                  </CardDescription>
                ))}
              </>
            )}
          </>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {formattedDate} às {formattedTime}
          </div>
          <div className="flex items-center gap-1">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="font-medium">{meal.calorias} kcal</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(meal)}>
          <Edit className="h-4 w-4 mr-1" /> Editar
        </Button>
        <Button variant="outline" size="sm" className="text-red-500" onClick={() => onDelete(meal.refid)}>
          <Trash2 className="h-4 w-4 mr-1" /> Excluir
        </Button>
      </CardFooter>
    </Card>
  )
}
