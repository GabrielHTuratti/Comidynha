"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Edit2, Save, X, Trash2 } from "lucide-react"
import { IIngredienteItem } from "@/model/ingrediente"
import { IngredientCardProps } from "@/types/intelligent-meal"


const categoriaOptions = [
  "vegetais",
  "frutas",
  "carnes",
  "peixes",
  "laticínios",
  "cereais",
  "leguminosas",
  "oleaginosas",
  "temperos",
  "condimentos",
  "bebidas",
  "outros",
]

const getCategoriaColor = (categoria: string) => {
  const cores = {
    vegetais: "bg-green-100 text-green-800",
    frutas: "bg-orange-100 text-orange-800",
    carnes: "bg-red-100 text-red-800",
    peixes: "bg-blue-100 text-blue-800",
    laticínios: "bg-yellow-100 text-yellow-800",
    cereais: "bg-amber-100 text-amber-800",
    leguminosas: "bg-emerald-100 text-emerald-800",
    oleaginosas: "bg-brown-100 text-brown-800",
    temperos: "bg-purple-100 text-purple-800",
    condimentos: "bg-pink-100 text-pink-800",
    bebidas: "bg-cyan-100 text-cyan-800",
    outros: "bg-gray-100 text-gray-800",
  }
  return cores[categoria as keyof typeof cores] || cores.outros
}

export function IngredientCard({ ingrediente, onUpdate, onRemove }: IngredientCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedIngrediente, setEditedIngrediente] = useState<IIngredienteItem>(ingrediente)

  const handleSave = () => {
    onUpdate(editedIngrediente)
    setIsEditing(false)
  }
  const verifyDate = () => {
    const dataIngrediente:Date = new Date(ingrediente.data_criacao);
    return dataIngrediente.getDay() === new Date().getDay();
  }

  const handleCancel = () => {
    setEditedIngrediente(ingrediente)
    setIsEditing(false)
  }

  return (
    <Card className="relative">
      {verifyDate() && <Badge className="absolute -top-2 -right-2 bg-green-500 text-white z-10">Novo</Badge>}

      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1">
            {isEditing ? (
              <Input
                value={editedIngrediente.nome}
                onChange={(e) => setEditedIngrediente((prev) => ({ ...prev, nome: e.target.value }))}
                className="font-medium"
              />
            ) : (
              <CardTitle className="text-lg capitalize">{ingrediente.nome}</CardTitle>
            )}
          </div>

          <div className="flex items-center gap-1">
            {isEditing ? (
              <>
                <Button size="sm" onClick={handleSave} className="h-8 w-8 p-0">
                  <Save className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancel} className="h-8 w-8 p-0 bg-transparent">
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)} className="h-8 w-8 p-0">
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={onRemove} className="h-8 w-8 p-0 text-red-600">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <select
              value={editedIngrediente.categoria}
              onChange={(e) => setEditedIngrediente((prev) => ({ ...prev, categoria: e.target.value }))}
              className="px-2 py-1 border rounded text-sm"
            >
              {categoriaOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          ) : (
            <Badge className={getCategoriaColor(ingrediente.categoria)}>{ingrediente.categoria}</Badge>
          )}

          <div className="flex items-center gap-2 flex-1">
            <span className="text-sm text-gray-600">Confiança:</span>
            <Progress value={ingrediente.confianca} className="flex-1" />
            <span className="text-sm font-medium">{ingrediente.confianca}%</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Descrição */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Descrição</Label>
          {isEditing ? (
            <Textarea
              value={editedIngrediente.descricao}
              onChange={(e) => setEditedIngrediente((prev) => ({ ...prev, descricao: e.target.value }))}
              rows={2}
            />
          ) : (
            <p className="text-sm text-gray-700">{ingrediente.descricao}</p>
          )}
        </div>

        {/* Quantidade Estimada */}
        {(ingrediente.quantidade_estimada || isEditing) && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Quantidade Estimada</Label>
            {isEditing ? (
              <Input
                value={editedIngrediente.quantidade_estimada || ""}
                onChange={(e) => setEditedIngrediente((prev) => ({ ...prev, quantidade_estimada: e.target.value }))}
                placeholder="Ex: 2 unidades, 100g..."
              />
            ) : (
              <p className="text-sm">{ingrediente.quantidade_estimada}</p>
            )}
          </div>
        )}

        {/* Informações Nutricionais */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Informações Nutricionais (por 100g)</Label>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="space-y-1">
              <span className="text-gray-600">Calorias:</span>
              {isEditing ? (
                <Input
                  type="number"
                  value={editedIngrediente.calorias_por_100g}
                  onChange={(e) =>
                    setEditedIngrediente((prev) => ({
                      ...prev,
                      calorias_por_100g: Number(e.target.value),
                    }))
                  }
                  className="h-8"
                />
              ) : (
                <span className="font-medium"> {ingrediente.calorias_por_100g} kcal</span>
              )}
            </div>

            <div className="space-y-1">
              <span className="text-gray-600">Proteínas:</span>
              {isEditing ? (
                <Input
                  type="number"
                  step="0.1"
                  value={editedIngrediente.proteinas_por_100g}
                  onChange={(e) =>
                    setEditedIngrediente((prev) => ({
                      ...prev,
                      proteinas_por_100g: Number(e.target.value),
                    }))
                  }
                  className="h-8"
                />
              ) : (
                <span className="font-medium"> {ingrediente.proteinas_por_100g}g</span>
              )}
            </div>

            <div className="space-y-1">
              <span className="text-gray-600">Carboidratos:</span>
              {isEditing ? (
                <Input
                  type="number"
                  step="0.1"
                  value={editedIngrediente.carboidratos_por_100g}
                  onChange={(e) =>
                    setEditedIngrediente((prev) => ({
                      ...prev,
                      carboidratos_por_100g: Number(e.target.value),
                    }))
                  }
                  className="h-8"
                />
              ) : (
                <span className="font-medium"> {ingrediente.carboidratos_por_100g}g</span>
              )}
            </div>

            <div className="space-y-1">
              <span className="text-gray-600">Gorduras:</span>
              {isEditing ? (
                <Input
                  type="number"
                  step="0.1"
                  value={editedIngrediente.gorduras_por_100g}
                  onChange={(e) =>
                    setEditedIngrediente((prev) => ({
                      ...prev,
                      gorduras_por_100g: Number(e.target.value),
                    }))
                  }
                  className="h-8"
                />
              ) : (
                <span className="font-medium"> {ingrediente.gorduras_por_100g}g</span>
              )}
            </div>
          </div>
        </div>

        {/* Tags */}
        {ingrediente.tags.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Tags</Label>
            <div className="flex flex-wrap gap-1">
              {ingrediente.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
