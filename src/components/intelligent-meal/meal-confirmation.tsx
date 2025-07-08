"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Check, Edit3, Plus, X, Sparkles } from "lucide-react"
import { IRefeicao } from "@/model/refeicao"

interface MealConfirmationProps {
  meal: IRefeicao
  onConfirm: (mealData: IRefeicao) => void
  onCancel: () => void
}

export function MealConfirmation({ meal, onConfirm, onCancel }: MealConfirmationProps) {
  const [editedMeal, setEditedMeal] = useState<IRefeicao>(meal)
  const [newIngredient, setNewIngredient] = useState("")

  const addIngredient = () => {
    if (newIngredient.trim()) {
      setEditedMeal((prev) => ({
        ...prev,
        ingredients: [...(prev.ingredients || []), newIngredient.trim()],
        desc: {
          ...prev.desc,
          extra: [...(prev.desc.extra || []), {
            campoid: Date.now().toString(),
            nome: "Ingrediente",
            valor: newIngredient.trim()
          }]
        }
      }))
      setNewIngredient("")
    }
  }

  const removeIngredient = (index: number) => {
    setEditedMeal((prev) => ({
      ...prev,
      ingredients: prev.ingredients?.filter((_, i) => i !== index) || [],
      desc: {
        ...prev.desc,
        extra: prev.desc.extra?.filter((_, i) => i !== index) || []
      }
    }))
  }

  const updateNutrition = (field: keyof typeof editedMeal.desc, value: string) => {
    setEditedMeal((prev) => ({
      ...prev,
      desc: {
        ...prev.desc,
        [field]: value
      }
    }))
  }

  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-emerald-500" />
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
              Detectado por IA
            </Badge>
          </div>
          <h2 className="text-xl font-semibold">Confirme os dados detectados</h2>
          {editedMeal.confidence && (
            <p className="text-sm text-muted-foreground">
              Confiança: {Math.round(editedMeal.confidence * 100)}%
            </p>
          )}
        </div>

        {/* Nome do prato */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Edit3 className="h-4 w-4" />
              Nome do Prato
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              value={editedMeal.nome}
              onChange={(e) => setEditedMeal((prev) => ({ ...prev, nome: e.target.value }))}
              placeholder="Nome da refeição"
            />
          </CardContent>
        </Card>

        {/* Ingredientes */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Ingredientes Detectados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {editedMeal.ingredients?.map((ingredient, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1 pr-1">
                  {ingredient}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-red-100"
                    onClick={() => removeIngredient(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>

            <Separator />

            <div className="flex gap-2">
              <Input
                placeholder="Adicionar ingrediente"
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addIngredient()}
              />
              <Button onClick={addIngredient} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Valores nutricionais */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Informações Nutricionais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="calories">Calorias</Label>
                <Input
                  id="calories"
                  type="number"
                  value={editedMeal.calorias}
                  onChange={(e) => setEditedMeal(prev => ({
                    ...prev,
                    calorias: Number(e.target.value) || 0
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="protein">Proteínas (g)</Label>
                <Input
                  id="protein"
                  value={editedMeal.desc.proteinas || ""}
                  onChange={(e) => updateNutrition("proteinas", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="carbs">Carboidratos (g)</Label>
                <Input
                  id="carbs"
                  value={editedMeal.desc.carboidratos || ""}
                  onChange={(e) => updateNutrition("carboidratos", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="fat">Gorduras (g)</Label>
                <Input
                  id="fat"
                  value={editedMeal.desc.gorduras || ""}
                  onChange={(e) => updateNutrition("gorduras", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sugestões da IA */}
        {editedMeal.suggestions && editedMeal.suggestions.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-500" />
                Sugestões da IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {editedMeal.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                    {suggestion}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Botões de ação */}
        <div className="flex gap-3 pt-4">
          <Button onClick={onCancel} variant="outline" className="flex-1 bg-transparent">
            Cancelar
          </Button>
          <Button onClick={() => onConfirm(editedMeal)} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
            <Check className="h-4 w-4 mr-2" />
            Confirmar e Salvar
          </Button>
        </div>
      </div>
    </div>
  )
}