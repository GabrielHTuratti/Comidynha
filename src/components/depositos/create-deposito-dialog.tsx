"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import type { ObjetivoDeposito } from "@/model/deposito"
import { CreateDepositoDialogProps, IFormDeposito, ShortIngredientsProps } from "@/types/intelligent-meal"


const objetivos: { value: ObjetivoDeposito; label: string; description: string }[] = [
  { value: "ganho-muscular", label: "Ganho Muscular", description: "Receitas ricas em proteínas" },
  { value: "perda-peso", label: "Perda de Peso", description: "Baixas calorias, alto teor de fibras" },
  { value: "manutencao", label: "Manutenção", description: "Equilíbrio nutricional" },
  { value: "receitas-doces", label: "Receitas Doces", description: "Sobremesas e doces saudáveis" },
  { value: "jantar-romantico", label: "Jantar Romântico", description: "Pratos sofisticados" },
  { value: "almoco-rapido", label: "Almoço Rápido", description: "Refeições práticas" },
  { value: "cafe-da-manha", label: "Café da Manhã", description: "Refeições matinais" },
  { value: "lanche-saudavel", label: "Lanche Saudável", description: "Lanches nutritivos" },
  { value: "comida-vegana", label: "Comida Vegana", description: "100% vegetal" },
  { value: "low-carb", label: "Low Carb", description: "Baixo teor de carboidratos" },
  { value: "dieta-mediterranea", label: "Dieta Mediterrânea", description: "Baseada na dieta mediterrânea" },
  { value: "personalizado", label: "Personalizado", description: "Defina seu próprio objetivo" },
]

export function CreateDepositoDialog({
  isOpen,
  onOpenChange,
  onCreateDeposito,
  ingredientesDisponiveis,
  userEmail,
}: CreateDepositoDialogProps) {
  const [formData, setFormData] = useState<IFormDeposito>({
    nome: "",
    descricao: "",
    objetivo: "",
    objetivo_personalizado: "",
    ingredientes: [],
    configuracao: {
      calorias_alvo: "",
      proteinas_min: "",
      carboidratos_max: "",
      gorduras_max: "",
      fibras_min: "",
      restricoes_alimentares: [],
      preferencias: [],
    },
  });

  const [novaRestricao, setNovaRestricao] = useState("")
  const [novaPreferencia, setNovaPreferencia] = useState("")

  const handleSubmit = () => {
    const ingredientesArray = Array.isArray(formData.ingredientes) 
    ? formData.ingredientes 
    : [];

    const deposito = {
      ...formData,
      userEmail: userEmail,
      ingredientes: ingredientesArray,
      configuracao: {
        ...formData.configuracao,
        calorias_alvo: formData.configuracao.calorias_alvo || "",
        proteinas_min: formData.configuracao.proteinas_min || "",
        carboidratos_max: formData.configuracao.carboidratos_max|| "",
        gorduras_max: formData.configuracao.gorduras_max || "",
        fibras_min: formData.configuracao.fibras_min || "",
      },
    }

    onCreateDeposito(deposito)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      nome: "",
      descricao: "",
      objetivo: "" as ObjetivoDeposito,
      objetivo_personalizado: "",
      ingredientes: [],
      configuracao: {
        calorias_alvo: "",
        proteinas_min: "",
        carboidratos_max: "",
        gorduras_max: "",
        fibras_min: "",
        restricoes_alimentares: [],
        preferencias: [],
      },
    })
    setNovaRestricao("")
    setNovaPreferencia("")
  }

  const toggleIngrediente = (ingrediente: ShortIngredientsProps) => {
    setFormData((prev) => ({
      ...prev,
      ingredientes: prev.ingredientes.includes(ingrediente)
        ? prev.ingredientes.filter((i) => i !== ingrediente)
        : [...prev.ingredientes, ingrediente],
    }))
  }

  const addRestricao = () => {
    if (novaRestricao.trim()) {
      setFormData((prev) => ({
        ...prev,
        configuracao: {
          ...prev.configuracao,
          restricoes_alimentares: [...prev.configuracao.restricoes_alimentares, novaRestricao.trim()],
        },
      }))
      setNovaRestricao("")
    }
  }

  const addPreferencia = () => {
    if (novaPreferencia.trim()) {
      setFormData((prev) => ({
        ...prev,
        configuracao: {
          ...prev.configuracao,
          preferencias: [...prev.configuracao.preferencias, novaPreferencia.trim()],
        },
      }))
      setNovaPreferencia("")
    }
  }

  const removeRestricao = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      configuracao: {
        ...prev.configuracao,
        restricoes_alimentares: prev.configuracao.restricoes_alimentares.filter((_, i) => i !== index),
      },
    }))
  }

  const removePreferencia = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      configuracao: {
        ...prev.configuracao,
        preferencias: prev.configuracao.preferencias.filter((_, i) => i !== index),
      },
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Depósito</DialogTitle>
          <DialogDescription>
            Organize seus ingredientes em depósitos temáticos e receba sugestões personalizadas da IA
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Informações Básicas */}
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome do Depósito</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData((prev) => ({ ...prev, nome: e.target.value }))}
                placeholder="Ex: Receitas Doces, Ganho Muscular..."
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData((prev) => ({ ...prev, descricao: e.target.value }))}
                placeholder="Descreva o propósito deste depósito..."
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="objetivo">Objetivo</Label>
              <Select
                value={formData.objetivo}
                onValueChange={(value: ObjetivoDeposito) => setFormData((prev) => ({ ...prev, objetivo: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o objetivo" />
                </SelectTrigger>
                <SelectContent>
                  {objetivos.map((obj) => (
                    <SelectItem key={`obj-${obj.value}`} value={obj.value}>
                      <div>
                        <div className="font-medium">{obj.label}</div>
                        <div className="text-sm text-muted-foreground">{obj.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.objetivo === "personalizado" && (
              <div className="grid gap-2">
                <Label htmlFor="objetivo_personalizado">Objetivo Personalizado</Label>
                <Input
                  id="objetivo_personalizado"
                  value={formData.objetivo_personalizado}
                  onChange={(e) => setFormData((prev) => ({ ...prev, objetivo_personalizado: e.target.value }))}
                  placeholder="Descreva seu objetivo personalizado..."
                />
              </div>
            )}
          </div>
          <div className="grid gap-2">
            <Label>{ingredientesDisponiveis.length} Ingredientes Disponíveis ({formData.ingredientes.length} selecionados)</Label>
            <div className="border rounded-lg p-4 max-h-40 overflow-y-auto">
              <div className="flex flex-wrap gap-2">
                {ingredientesDisponiveis.map((ingrediente) => (
                  <Badge
                    key={ingrediente.refid}
                    className="cursor-pointer"
                    variant={formData.ingredientes.includes(ingrediente) ? "default" : "outline"}
                    onClick={() => toggleIngrediente(ingrediente)}
                  >
                    {ingrediente.nome}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <div className="grid gap-4">
            <Label className="text-base font-medium">Configurações Nutricionais (Opcional)</Label>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="calorias">Calorias Alvo</Label>
                <Input
                  id="calorias"
                  type="number"
                  value={formData.configuracao.calorias_alvo}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      configuracao: { ...prev.configuracao, calorias_alvo: e.target.value },
                    }))
                  }
                  placeholder="Ex: 2000"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="proteinas">Proteínas Mín. (g)</Label>
                <Input
                  id="proteinas"
                  type="number"
                  value={formData.configuracao.proteinas_min}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      configuracao: { ...prev.configuracao, proteinas_min: e.target.value },
                    }))
                  }
                  placeholder="Ex: 100"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="carboidratos">Carboidratos Máx. (g)</Label>
                <Input
                  id="carboidratos"
                  type="number"
                  value={formData.configuracao.carboidratos_max}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      configuracao: { ...prev.configuracao, carboidratos_max: e.target.value },
                    }))
                  }
                  placeholder="Ex: 200"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="gorduras">Gorduras Máx. (g)</Label>
                <Input
                  id="gorduras"
                  type="number"
                  value={formData.configuracao.gorduras_max}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      configuracao: { ...prev.configuracao, gorduras_max: e.target.value },
                    }))
                  }
                  placeholder="Ex: 80"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="fibras">Fibras Mín. (g)</Label>
                <Input
                  id="fibras"
                  type="number"
                  value={formData.configuracao.fibras_min}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      configuracao: { ...prev.configuracao, fibras_min: e.target.value },
                    }))
                  }
                  placeholder="Ex: 25"
                />
              </div>
            </div>
          </div>

          {/* Restrições Alimentares */}
          <div className="grid gap-2">
            <Label>Restrições Alimentares</Label>
            <div className="flex gap-2">
              <Input
                value={novaRestricao}
                onChange={(e) => setNovaRestricao(e.target.value)}
                placeholder="Ex: sem glúten, sem lactose..."
                onKeyPress={(e) => e.key === "Enter" && addRestricao()}
              />
              <Button type="button" onClick={addRestricao} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.configuracao.restricoes_alimentares.map((restricao, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {restricao}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeRestricao(index)} />
                </Badge>
              ))}
            </div>
          </div>

          {/* Preferências */}
          <div className="grid gap-2">
            <Label>Preferências</Label>
            <div className="flex gap-2">
              <Input
                value={novaPreferencia}
                onChange={(e) => setNovaPreferencia(e.target.value)}
                placeholder="Ex: comida picante, pratos frios..."
                onKeyPress={(e) => e.key === "Enter" && addPreferencia()}
              />
              <Button type="button" onClick={addPreferencia} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.configuracao.preferencias.map((preferencia, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {preferencia}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removePreferencia(index)} />
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!formData.nome || !formData.descricao || !formData.objetivo || formData.ingredientes.length === 0}
          >
            Criar Depósito
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
