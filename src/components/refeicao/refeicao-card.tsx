"use client"

import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Flame, Edit, Trash2, Sparkles, ChefHat } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
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

  const hasAIData = meal.confidence !== undefined || meal.ingredients?.length || meal.suggestions?.length

  return (
    <Card className="relative">
      {/* Badge de IA se foi detectado por IA */}
      {hasAIData && (
        <div className="absolute top-2 right-2 z-10">
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 text-xs">
            <Sparkles className="h-3 w-3 mr-1" />
            IA
          </Badge>
        </div>
      )}

      <CardHeader className="pb-2">
        <div className="flex justify-between items-start pr-8">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-emerald-100 p-1 dark:bg-emerald-900">{getMealTypeIcon(meal.tipo)}</div>
            <div className="flex-1">
              <CardTitle className="text-base">{meal.nome}</CardTitle>
              {meal.confidence && (
                <p className="text-xs text-muted-foreground">Confiança: {Math.round(meal.confidence * 100)}%</p>
              )}
            </div>
          </div>
        </div>

        <Badge variant="outline" className="w-fit">
          {getMealTypeName(meal.tipo)}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Ingredientes detectados por IA */}
        {meal.ingredients && meal.ingredients.length > 0 && (
          <div>
            <div className="flex items-center gap-1 mb-2">
              <ChefHat className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-medium">Ingredientes:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {meal.ingredients.slice(0, 3).map((ingredient, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {ingredient}
                </Badge>
              ))}
              {meal.ingredients.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{meal.ingredients.length - 3} mais
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Informações nutricionais */}
        {meal.desc && (
          <div>
            <span className="text-sm font-medium">Nutrição:</span>
            <div className="grid grid-cols-3 gap-2 mt-1 text-xs text-muted-foreground">
              {meal.desc.proteinas && <div>Proteínas: {meal.desc.proteinas}g</div>}
              {meal.desc.carboidratos && <div>Carboidratos: {meal.desc.carboidratos}g</div>}
              {meal.desc.gorduras && <div>Gorduras: {meal.desc.gorduras}g</div>}
            </div>

            {/* Campos extras */}
            {meal.desc.extra && meal.desc.extra.length > 0 && (
              <div className="mt-2">
                {meal.desc.extra.slice(0, 2).map((campo, index) => (
                  <div key={index} className="text-xs text-muted-foreground">
                    {campo.nome}: {campo.valor}
                  </div>
                ))}
                {meal.desc.extra.length > 2 && (
                  <div className="text-xs text-muted-foreground">+{meal.desc.extra.length - 2} nutrientes</div>
                )}
              </div>
            )}
          </div>
        )}

        <Separator />

        {/* Data, hora e calorias */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {formattedDate} às {formattedTime}
          </div>
          <div className="flex items-center gap-1">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="font-medium">{meal.calorias} kcal</span>
          </div>
        </div>

        {/* Sugestões da IA (primeira sugestão apenas) */}
        {meal.suggestions && meal.suggestions.length > 0 && (
          <div className="bg-emerald-50 p-2 rounded-md">
            <div className="flex items-start gap-2">
              <Sparkles className="h-3 w-3 text-emerald-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-emerald-700 line-clamp-2">{meal.suggestions[0]}</p>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-end gap-2 pt-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(meal)}>
          <Edit className="h-4 w-4 mr-1" /> Editar
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-red-500 bg-transparent"
          onClick={() => onDelete(meal.refid)}
        >
          <Trash2 className="h-4 w-4 mr-1" /> Excluir
        </Button>
      </CardFooter>
    </Card>
  )
}
