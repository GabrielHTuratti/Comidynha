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
import { useRefeicaoValidation } from "@/hooks/use-refeicaoValidation"
import { Sparkles, Plus, X } from "lucide-react"
import { useState, useEffect } from "react"

interface AddMealDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onAddMeal: () => void
  refeicaoNova: Omit<IRefeicao, "_id">
  updateRefeicaoNova: (updates: Omit<IRefeicao, "_id">) => void
  updateRefeicaoNovaDesc: (updates: nutridesc) => void
  updateRefeicaoNovaExtra: (id: string, key: string, value: string) => void
  removeRefeicaoNovaExtra: (key: string) => void
  addNewExtraField: () => void
}

export function AddMealDialog({
  isOpen,
  onOpenChange,
  onAddMeal,
  refeicaoNova,
  updateRefeicaoNova,
  updateRefeicaoNovaDesc,
  updateRefeicaoNovaExtra,
  removeRefeicaoNovaExtra,
  addNewExtraField,
}: AddMealDialogProps) {
  const { errors, validateField, validateForm, validateExtraField, validateAllExtras } = useRefeicaoValidation()
  const [newIngredient, setNewIngredient] = useState("")
  const [newSuggestion, setNewSuggestion] = useState("")

  // Limpar erros quando o diálogo abrir
  useEffect(() => {
    if (isOpen) {
      // Validar campos iniciais para limpar erros antigos
      validateField("nome", refeicaoNova.nome)
      validateField("calorias", refeicaoNova.calorias)
      validateField("tipo", refeicaoNova.tipo)
      validateField("data", refeicaoNova.data)
    }
  }, [isOpen])

  const handleAddMeal = () => {
    if (validateForm(refeicaoNova)) {
      onAddMeal()
    }
  }

  const handleFieldChange = (field: string, value: string | number | string[]) => {
    updateRefeicaoNova({ ...refeicaoNova, [field]: value })
    validateField(field, value)
  }

  const handleDescChange = (field: string, value: string) => {
    const newDesc = { ...refeicaoNova.desc, [field]: value }
    updateRefeicaoNovaDesc(newDesc)
    validateField(`desc.${field}`, value)
  }

  const addIngredient = () => {
    if (newIngredient.trim()) {
      const currentIngredients = refeicaoNova.ingredients || []
      handleFieldChange("ingredients", [...currentIngredients, newIngredient.trim()])
      setNewIngredient("")
    }
  }

  const removeIngredient = (index: number) => {
    const currentIngredients = refeicaoNova.ingredients || []
    handleFieldChange(
      "ingredients",
      currentIngredients.filter((_, i) => i !== index),
    )
  }

  const addSuggestion = () => {
    if (newSuggestion.trim()) {
      const currentSuggestions = refeicaoNova.suggestions || []
      handleFieldChange("suggestions", [...currentSuggestions, newSuggestion.trim()])
      setNewSuggestion("")
    }
  }

  const removeSuggestion = (index: number) => {
    const currentSuggestions = refeicaoNova.suggestions || []
    handleFieldChange(
      "suggestions",
      currentSuggestions.filter((_, i) => i !== index),
    )
  }

  const hasAIData =
    refeicaoNova.confidence !== undefined ||
    (refeicaoNova.ingredients && refeicaoNova.ingredients.length > 0) ||
    (refeicaoNova.suggestions && refeicaoNova.suggestions.length > 0)

  // Verificar se há erros críticos que impedem o envio
  const hasBlockingErrors = () => {
    const criticalFields = ["nome", "calorias", "tipo", "data", "desc.proteinas", "desc.carboidratos", "desc.gorduras"]
    return criticalFields.some((field) => errors[field] !== undefined)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] flex flex-col max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>Adicionar Nova Refeição</DialogTitle>
            {hasAIData && (
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                <Sparkles className="h-3 w-3 mr-1" />
                Detectado por IA
              </Badge>
            )}
          </div>
          <DialogDescription>Preencha os detalhes da sua refeição abaixo.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4 overflow-y-auto pr-2">
          {/* Nome da refeição */}
          <div className="grid gap-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              maxLength={51}
              value={refeicaoNova.nome}
              onChange={(e) => handleFieldChange("nome", e.target.value)}
              placeholder="Ex: Salada com frango grelhado"
              className={hasAIData ? "border-emerald-200 bg-emerald-50" : ""}
            />
            {errors.nome && <p className="text-sm text-red-500">{errors.nome}</p>}
          </div>

          {/* Confiança da IA (se disponível) */}
          {refeicaoNova.confidence !== undefined && (
            <div className="grid gap-2">
              <Label>Confiança da IA</Label>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full"
                    style={{ width: `${refeicaoNova.confidence * 100}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground">{Math.round(refeicaoNova.confidence * 100)}%</span>
              </div>
            </div>
          )}

          {/* Ingredientes */}
          <div className="grid gap-2">
            <Label>Ingredientes</Label>
            <div className="space-y-2">
              {refeicaoNova.ingredients && refeicaoNova.ingredients.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {refeicaoNova.ingredients.map((ingredient, index) => (
                    <Badge key={`ingredient-${index}-${ingredient.substring(0,5)}`} variant="outline" className="flex items-center gap-1 pr-1">
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
            <Label>Informações Nutricionais</Label>
            <div className="grid gap-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="grid gap-2">
                  <Label>Proteínas (g)</Label>
                  <Input
                    value={refeicaoNova.desc.proteinas || ""}
                    type="text"
                    placeholder="0"
                    onChange={(e) => {
                      const value = e.target.value
                      // Permitir apenas números e ponto decimal
                      if (value === "" || /^\d*\.?\d*$/.test(value)) {
                        handleDescChange("proteinas", value)
                      }
                    }}
                  />
                  {errors["desc.proteinas"] && <p className="text-sm text-red-500">{errors["desc.proteinas"]}</p>}
                </div>
                <div className="grid gap-2">
                  <Label>Carboidratos (g)</Label>
                  <Input
                    value={refeicaoNova.desc.carboidratos || ""}
                    type="text"
                    placeholder="0"
                    onChange={(e) => {
                      const value = e.target.value
                      if (value === "" || /^\d*\.?\d*$/.test(value)) {
                        handleDescChange("carboidratos", value)
                      }
                    }}
                  />
                  {errors["desc.carboidratos"] && <p className="text-sm text-red-500">{errors["desc.carboidratos"]}</p>}
                </div>
                <div className="grid gap-2">
                  <Label>Gorduras (g)</Label>
                  <Input
                    value={refeicaoNova.desc.gorduras || ""}
                    type="text"
                    placeholder="0"
                    onChange={(e) => {
                      const value = e.target.value
                      if (value === "" || /^\d*\.?\d*$/.test(value)) {
                        handleDescChange("gorduras", value)
                      }
                    }}
                  />
                  {errors["desc.gorduras"] && <p className="text-sm text-red-500">{errors["desc.gorduras"]}</p>}
                </div>
              </div>

              {/* Campos extras de nutrição */}
              {refeicaoNova.desc.extra?.map((campo, index) => (
                <div key={`extra-${campo.campoid}`} className="grid grid-cols-3 gap-2 items-end">
                  <div className="grid gap-2">
                    <Label>Nome</Label>
                    <Input
                      value={campo.nome}
                      onChange={(e) => {
                        updateRefeicaoNovaExtra(campo.campoid, e.target.value, campo.valor)
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
                        updateRefeicaoNovaExtra(campo.campoid, campo.nome, e.target.value)
                        validateExtraField({ ...campo, valor: e.target.value }, index)
                      }}
                    />
                    {errors[`extra.${index}.valor`] && (
                      <p className="text-sm text-red-500">{errors[`extra.${index}.valor`]}</p>
                    )}
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      removeRefeicaoNovaExtra(campo.campoid)
                      setTimeout(() =>
                        validateAllExtras(refeicaoNova.desc.extra?.filter((e) => e.campoid !== campo.campoid)),
                      )
                    }}
                  >
                    Remover
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => {
                  addNewExtraField()
                  setTimeout(() => validateAllExtras(refeicaoNova.desc.extra))
                }}
              >
                Adicionar Campo Extra
              </Button>
            </div>
          </div>

          {/* Calorias */}
          <div className="grid gap-2">
            <Label htmlFor="calorias">Calorias *</Label>
            <Input
              id="calorias"
              value={refeicaoNova.calorias || ""}
              placeholder="Ex: 350"
              type="number"
              min="0"
              onChange={(e) => {
                const value = e.target.value
                handleFieldChange("calorias", value === "" ? "" : Number.parseInt(value) || 0)
              }}
            />
            {errors.calorias && <p className="text-sm text-red-500">{errors.calorias}</p>}
          </div>

          {/* Data e Hora */}
          <div className="grid gap-2">
            <Label htmlFor="datetime">Data e Hora *</Label>
            <Input
              id="datetime"
              type="datetime-local"
              value={IsoStringToDate(refeicaoNova.data)}
              onChange={(e) => handleFieldChange("data", dateToIsoString(e.target.value))}
            />
            {errors.data && <p className="text-sm text-red-500">{errors.data}</p>}
          </div>

          {/* Tipo de Refeição */}
          <div className="grid gap-2">
            <Label htmlFor="type">Tipo de Refeição *</Label>
            <Select value={refeicaoNova.tipo} onValueChange={(value) => handleFieldChange("tipo", value)}>
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
              {refeicaoNova.suggestions && refeicaoNova.suggestions.length > 0 && (
                <div className="space-y-2">
                  {refeicaoNova.suggestions.map((suggestion, index) => (
                    <div key={`suggestion-${index}-${suggestion.substring(0,5)}`} className="flex items-start gap-2 p-2 bg-emerald-50 rounded-md">
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
            onClick={handleAddMeal}
            disabled={hasBlockingErrors()}
          >
            Adicionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
