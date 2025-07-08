"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { IsoStringToDate, dateToIsoString } from "@/lib/utils-refeicao"
import type { IRefeicao, nutridesc } from "@/model/refeicao"
import type { SetStateAction } from "react"
import { useRefeicaoValidation } from "@/hooks/use-refeicaoValidation"
import { Sparkles, Plus, X } from "lucide-react"
import { useState } from "react"

interface EditMealDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onEditMeal: () => void
  refeicaoAtual: IRefeicao | null
  updateRefeicaoAtual: (updates: SetStateAction<IRefeicao | null>) => void
  updateRefeicaoAtualDesc: (updates: nutridesc) => void
  updateRefeicaoAtualExtra: (id: string, newkey: string, newvalue: string) => void
  removeRefeicaoAtualExtra: (key: string) => void
  addCurrentExtraField: () => void
}

export function EditMealDialog({
  isOpen,
  onOpenChange,
  onEditMeal,
  refeicaoAtual,
  updateRefeicaoAtual,
  updateRefeicaoAtualDesc,
  removeRefeicaoAtualExtra,
  updateRefeicaoAtualExtra,
  addCurrentExtraField,
}: EditMealDialogProps) {
  const { errors, validateField, validateForm, validateAllExtras, validateExtraField } = useRefeicaoValidation()
  const [newIngredient, setNewIngredient] = useState("")
  const [newSuggestion, setNewSuggestion] = useState("")

  const handleEditMeal = () => {
    if (refeicaoAtual && validateForm(refeicaoAtual)) {
      onEditMeal()
    }
  }

  const handleFieldChange = (field: string, value: string | number | string[]) => {
    if (!refeicaoAtual) return
    updateRefeicaoAtual({ ...refeicaoAtual, [field]: value })
    if (typeof value === "string") {
      validateField(field, value)
    }
  }

  const handleDescChange = (field: string, value: string) => {
    if (!refeicaoAtual) return
    const newDesc = { ...refeicaoAtual.desc, [field]: value }
    updateRefeicaoAtualDesc(newDesc)
    validateField(`desc.${field}`, value)
  }

  const addIngredient = () => {
    if (!refeicaoAtual || !newIngredient.trim()) return
    const currentIngredients = refeicaoAtual.ingredients || []
    handleFieldChange("ingredients", [...currentIngredients, newIngredient.trim()])
    setNewIngredient("")
  }

  const removeIngredient = (index: number) => {
    if (!refeicaoAtual) return
    const currentIngredients = refeicaoAtual.ingredients || []
    handleFieldChange(
      "ingredients",
      currentIngredients.filter((_, i) => i !== index),
    )
  }

  const addSuggestion = () => {
    if (!refeicaoAtual || !newSuggestion.trim()) return
    const currentSuggestions = refeicaoAtual.suggestions || []
    handleFieldChange("suggestions", [...currentSuggestions, newSuggestion.trim()])
    setNewSuggestion("")
  }

  const removeSuggestion = (index: number) => {
    if (!refeicaoAtual) return
    const currentSuggestions = refeicaoAtual.suggestions || []
    handleFieldChange(
      "suggestions",
      currentSuggestions.filter((_, i) => i !== index),
    )
  }

  if (!refeicaoAtual) return null

  const hasAIData =
    refeicaoAtual.confidence !== undefined ||
    (refeicaoAtual.ingredients && refeicaoAtual.ingredients.length > 0) ||
    (refeicaoAtual.suggestions && refeicaoAtual.suggestions.length > 0)

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] flex flex-col max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>Editar Refeição</DialogTitle>
            {hasAIData && (
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                <Sparkles className="h-3 w-3 mr-1" />
                Detectado por IA
              </Badge>
            )}
          </div>
          <DialogDescription>Atualize os detalhes da sua refeição.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4 overflow-y-auto pr-2">
          {/* Nome da refeição */}
          <div className="grid gap-2">
            <Label htmlFor="edit-name">Nome</Label>
            <Input
              id="edit-name"
              maxLength={51}
              value={refeicaoAtual.nome}
              onChange={(e) => handleFieldChange("nome", e.target.value)}
              className={hasAIData ? "border-emerald-200 bg-emerald-50" : ""}
            />
            {errors.nome && <p className="text-sm text-red-500">{errors.nome}</p>}
          </div>

          {/* Confiança da IA (se disponível) */}
          {refeicaoAtual.confidence !== undefined && (
            <div className="grid gap-2">
              <Label>Confiança da IA</Label>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full"
                    style={{ width: `${refeicaoAtual.confidence * 100}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground">{Math.round(refeicaoAtual.confidence * 100)}%</span>
              </div>
            </div>
          )}

          {/* Ingredientes */}
          <div className="grid gap-2">
            <Label>Ingredientes</Label>
            <div className="space-y-2">
              {refeicaoAtual.ingredients && refeicaoAtual.ingredients.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {refeicaoAtual.ingredients.map((ingredient, index) => (
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
              )}

              <div className="flex gap-2">
                <Input
                  placeholder="Adicionar ingrediente"
                  value={newIngredient}
                  onChange={(e) => setNewIngredient(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addIngredient()}
                />
                <Button onClick={addIngredient} size="sm" variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* Informações Nutricionais */}
          <div className="grid gap-2">
            <Label htmlFor="edit-desc">Descrição Nutricional</Label>
            <div className="grid grid-cols-3 gap-2">
              <div className="grid gap-2">
                <Label htmlFor="edit-gordura">Gordura (g)</Label>
                <Input
                  id="edit-gordura"
                  value={refeicaoAtual.desc.gorduras}
                  max={99999999999}
                  type="number"
                  onKeyDown={(e) => {
                    if (!/[0-9]|Backspace|Tab|Delete|ArrowLeft|ArrowRight/.test(e.key)) {
                      e.preventDefault()
                    }
                  }}
                  inputMode="numeric"
                  onChange={(e) => {
                    const value = e.target.value
                    if (value.length <= 11) {
                      handleDescChange("gorduras", value)
                    }
                  }}
                />
                {errors["desc.gorduras"] && <p className="text-sm text-red-500">{errors["desc.gorduras"]}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-prot">Proteína (g)</Label>
                <Input
                  value={refeicaoAtual.desc.proteinas}
                  max={99999999999}
                  type="number"
                  onKeyDown={(e) => {
                    if (!/[0-9]|Backspace|Tab|Delete|ArrowLeft|ArrowRight/.test(e.key)) {
                      e.preventDefault()
                    }
                  }}
                  inputMode="numeric"
                  onChange={(e) => {
                    const value = e.target.value
                    if (value.length <= 11) {
                      handleDescChange("proteinas", value)
                    }
                  }}
                />
                {errors["desc.proteinas"] && <p className="text-sm text-red-500">{errors["desc.proteinas"]}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-carb">Carboidrato (g)</Label>
                <Input
                  value={refeicaoAtual.desc.carboidratos}
                  max={99999999999}
                  type="number"
                  onKeyDown={(e) => {
                    if (!/[0-9]|Backspace|Tab|Delete|ArrowLeft|ArrowRight/.test(e.key)) {
                      e.preventDefault()
                    }
                  }}
                  inputMode="numeric"
                  onChange={(e) => {
                    const value = e.target.value
                    if (value.length <= 11) {
                      handleDescChange("carboidratos", value)
                    }
                  }}
                />
                {errors["desc.carboidratos"] && <p className="text-sm text-red-500">{errors["desc.carboidratos"]}</p>}
              </div>
            </div>

            {/* Campos extras */}
            {refeicaoAtual.desc.extra?.map((campo, index) => (
              <div key={campo.campoid} className="grid grid-cols-3 gap-2 items-end">
                <div className="grid gap-2">
                  <Label>Nome</Label>
                  <Input
                    value={campo.nome}
                    onChange={(e) => {
                      updateRefeicaoAtualExtra(campo.campoid, e.target.value, campo.valor)
                      validateExtraField({ ...campo, nome: e.target.value }, index)
                    }}
                  />
                  {errors[`extra.${index}.nome`] && (
                    <p className="text-sm text-red-500">{errors[`extra.${index}.nome`]}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label>Valor</Label>
                  <Input
                    value={campo.valor}
                    onChange={(e) => {
                      updateRefeicaoAtualExtra(campo.campoid, campo.nome, e.target.value)
                      validateExtraField({ ...campo, valor: e.target.value }, index)
                    }}
                  />
                  {errors[`extra.${index}.valor`] && (
                    <p className="text-sm text-red-500">{errors[`extra.${index}.valor`]}</p>
                  )}
                </div>
                <Button variant="destructive" onClick={() => removeRefeicaoAtualExtra(campo.campoid)}>
                  Remover
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() => {
                addCurrentExtraField()
                setTimeout(() => validateAllExtras(refeicaoAtual.desc.extra))
              }}
            >
              Adicionar Campo Extra
            </Button>
          </div>

          {/* Calorias */}
          <div className="grid gap-2">
            <Label htmlFor="edit-calorias">Calorias</Label>
            <Input
              id="calorias"
              value={refeicaoAtual.calorias || ""}
              placeholder="Ex: 350"
              max={99999999999}
              type="number"
              onKeyDown={(e) => {
                if (!/[0-9]|Backspace|Tab|Delete|ArrowLeft|ArrowRight/.test(e.key)) {
                  e.preventDefault()
                }
              }}
              inputMode="numeric"
              onChange={(e) => {
                const value = e.target.value
                if (value.length <= 11) {
                  handleFieldChange("calorias", value)
                }
              }}
            />
            {errors.calorias && <p className="text-sm text-red-500">{errors.calorias}</p>}
          </div>

          {/* Data e Hora */}
          <div className="grid gap-2">
            <Label htmlFor="edit-datetime">Data e Hora</Label>
            <Input
              id="edit-datetime"
              type="datetime-local"
              value={IsoStringToDate(refeicaoAtual.data)}
              onChange={(e) => handleFieldChange("data", dateToIsoString(e.target.value))}
            />
            {errors.data && <p className="text-sm text-red-500">{errors.data}</p>}
          </div>

          {/* Tipo de Refeição */}
          <div className="grid gap-2">
            <Label htmlFor="edit-type">Tipo de Refeição</Label>
            <Select value={refeicaoAtual.tipo} onValueChange={(value) => handleFieldChange("tipo", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cafe-da-manha">Café da manhã</SelectItem>
                <SelectItem value="almoco">Almoço</SelectItem>
                <SelectItem value="lanche-da-tarde">Lanche da tarde</SelectItem>
                <SelectItem value="janta">Janta</SelectItem>
              </SelectContent>
            </Select>
            {errors.tipo && <p className="text-sm text-red-500">{errors.tipo}</p>}
          </div>

          {/* Sugestões */}
          <div className="grid gap-2">
            <Label>Sugestões Nutricionais</Label>
            <div className="space-y-2">
              {refeicaoAtual.suggestions && refeicaoAtual.suggestions.length > 0 && (
                <div className="space-y-2">
                  {refeicaoAtual.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start gap-2 p-2 bg-emerald-50 rounded-md">
                      <Sparkles className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-emerald-700 flex-1">{suggestion}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-red-100"
                        onClick={() => removeSuggestion(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <Textarea
                  placeholder="Adicionar sugestão nutricional"
                  value={newSuggestion}
                  onChange={(e) => setNewSuggestion(e.target.value)}
                  rows={2}
                />
                <Button onClick={addSuggestion} size="sm" variant="outline" className="w-full bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Sugestão
                </Button>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={handleEditMeal}
            disabled={Object.values(errors).some((error) => error !== undefined)}
          >
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
