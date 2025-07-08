"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, X, Save, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { IngredientCard } from "./ingredient-card"
import { IIngredienteItem } from "@/model/ingrediente"
import { DetectionResultsProps } from "@/types/intelligent-meal"

export function DetectionResults({ result, onSave, onCancel }: DetectionResultsProps) {
  const [ingredientes, setIngredientes] = useState<IIngredienteItem[]>(result.ingredientes)
  const [isSaving, setIsSaving] = useState(false)

  const novosIngredientes = ingredientes.filter(ing => ing.origem === 'detectado').length

  const handleUpdateIngredient = (index: number, updatedIngredient: IIngredienteItem) => {
    setIngredientes(prev => {
      const newIngredients = [...prev]
      newIngredients[index] = updatedIngredient
      return newIngredients
    })
  }

  const handleRemoveIngredient = (index: number) => {
    setIngredientes(prev => prev.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    if (ingredientes.length === 0) {
      toast.error("Nenhum ingrediente para salvar")
      return
    }

    setIsSaving(true)
    try {
      await onSave(ingredientes)
      toast.success(`${ingredientes.length} ingrediente${ingredientes.length !== 1 ? 's' : ''} salvo${ingredientes.length !== 1 ? 's' : ''} com sucesso!`)
    } catch (error) {
      toast.error("Erro ao salvar ingredientes")
      console.error("Erro:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Ingredientes Detectados
            </CardTitle>
            <CardDescription>Revise e edite os ingredientes antes de salvar</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isSaving || ingredientes.length === 0}>
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar ({ingredientes.length})
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm text-gray-600 pt-2">
          {result.confiancaMedia && (
            <div className="flex items-center gap-2">
              <span>Confiança Média:</span>
              <Progress value={result.confiancaMedia} className="w-20" />
              <span className="font-medium">{(result.confiancaMedia * 100)}%</span>
            </div>
          )}
          <span>Total: {ingredientes.length}</span>
          <span className="text-green-600">Novos: {novosIngredientes}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {result.observacoes && (
          <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-800">{result.observacoes}</p>
          </div>
        )}

        {ingredientes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Todos os ingredientes foram removidos</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {ingredientes.map((ingrediente, index) => (
              <IngredientCard
                key={`${ingrediente.nome}-${index}`}
                ingrediente={ingrediente}
                onUpdate={(updated) => handleUpdateIngredient(index, updated)}
                onRemove={() => handleRemoveIngredient(index)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}