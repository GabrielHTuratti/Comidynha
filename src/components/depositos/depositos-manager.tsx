"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Filter } from "lucide-react"
import { toast } from "sonner"
import { CreateDepositoDialog } from "./create-deposito-dialog"
import { DepositoCard } from "./deposito-card"
import { SuggestionsDisplay } from "./suggestions-display"
import type { IDeposito } from "@/model/deposito"
import { DepositosManagerProps, IFormDeposito, ShortIngredientsProps } from "@/types/intelligent-meal"




export function DepositosManager({ userEmail }: DepositosManagerProps) {
  const [depositos, setDepositos] = useState<IDeposito[]>([])
  const [ingredientesDisponiveis, setIngredientesDisponiveis] = useState<ShortIngredientsProps[]>([{refid: "", nome: ""}])
  const [selectedDeposito, setSelectedDeposito] = useState<IDeposito | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterObjetivo, setFilterObjetivo] = useState("todos")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDepositos()
    loadIngredientesDisponiveis()
  }, [userEmail])

  const loadDepositos = async () => {
    try {
      const response = await fetch(`/api/depositos`)
      if (response.ok) {
        const data = await response.json()
        setDepositos(data.depositos)
      }
    } catch (error) {
      console.error("Erro ao carregar depósitos:", error)
      toast.error("Erro ao carregar depósitos")
    } finally {
      setLoading(false)
    }
  }

  const loadIngredientesDisponiveis = async () => {
    try {
      const response = await fetch("/api/ingredientes?limit=1000")
      if (response.ok) {
        const data = await response.json()
        const ingredientes:ShortIngredientsProps[] = data.ingredientes

        setIngredientesDisponiveis(ingredientes)
      }
    } catch (error) {
      console.error("Erro ao carregar ingredientes:", error)
    }
  }

  const handleCreateDeposito = async (depositoData: IFormDeposito) => {
    try {
      const response = await fetch("/api/depositos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(depositoData),
      })

      if (response.ok) {
        const data = await response.json()
        setDepositos([data.deposito, ...depositos])
        setIsCreateDialogOpen(false)
        toast.success("Depósito criado com sucesso!")
      } else {
        throw new Error("Erro ao criar depósito: " + response.json())
      }
    } catch (error) {
      console.error(error)
      toast.error("Erro ao criar depósito")
    }
  }

  const handleGenerateSuggestions = async (depositoId: string) => {
    setIsGenerating(depositoId)
    try {
      const response = await fetch(`/api/depositos/${depositoId}/sugestoes`, {
        method: "POST",
        body: JSON.stringify({id: depositoId})
      })

      if (response.ok) {
        const data = await response.json()

        // Atualizar o depósito na lista
        setDepositos((prev) =>
          prev.map((dep) =>
            dep._id === depositoId ? { ...dep, sugestoes_geradas: data.sugestoes, ultima_sugestao: new Date() } : dep,
          ),
        )

        // Se este depósito está selecionado, atualizar também
        if (selectedDeposito?._id === depositoId) {
          setSelectedDeposito((prev) =>
            prev
              ? {
                  ...prev,
                  sugestoes_geradas: data.sugestoes,
                  ultima_sugestao: new Date(),
                }
              : null,
          )
        }

        toast.success(`Sugestões geradas! ${data.total_receitas} receitas e ${data.total_refeicoes} refeições`)
      } else {
        throw new Error("Erro ao gerar sugestões:" + await response.text())
      }
    } catch (error) {
      console.error("Erro ao gerar sugestões:", error)
      toast.error("Erro ao gerar sugestões")
    } finally {
      setIsGenerating(null)
    }
  }

  const handleDeleteDeposito = async (depositoId: string) => {
    if (!confirm("Tem certeza que deseja excluir este depósito?")) return

    try {
      const response = await fetch(`/api/depositos/${depositoId}`, {
        method: "DELETE",
        // body: JSON.stringify({id: depositoId})
      })

      if (response.ok) {
        setDepositos((prev) => prev.filter((dep) => dep._id !== depositoId))
        if (selectedDeposito?._id === depositoId) {
          setSelectedDeposito(null)
        }
        toast.success("Depósito excluído com sucesso!")
      } else {
        throw new Error("Erro ao excluir depósito")
      }
    } catch (error) {
      console.error("Erro ao excluir depósito:", error)
      toast.error("Erro ao excluir depósito")
    }
  }

  const filteredDepositos = depositos.filter((deposito) => {
    const matchesSearch =
      deposito.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deposito.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterObjetivo === "todos" || deposito.objetivo === filterObjetivo
    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Carregando depósitos...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Depósitos de Ingredientes</h2>
          <p className="text-muted-foreground">Organize seus ingredientes e receba sugestões personalizadas da IA</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Depósito
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar depósitos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterObjetivo} onValueChange={setFilterObjetivo}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filtrar por objetivo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os objetivos</SelectItem>
            <SelectItem value="ganho-muscular">Ganho Muscular</SelectItem>
            <SelectItem value="perda-peso">Perda de Peso</SelectItem>
            <SelectItem value="receitas-doces">Receitas Doces</SelectItem>
            <SelectItem value="jantar-romantico">Jantar Romântico</SelectItem>
            <SelectItem value="almoco-rapido">Almoço Rápido</SelectItem>
            <SelectItem value="personalizado">Personalizado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Conteúdo Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lista de Depósitos */}
        <div className="space-y-4">
          {filteredDepositos.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <div className="text-center space-y-2">
                  <Plus className="h-12 w-12 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground">
                    {depositos.length === 0 ? "Nenhum depósito criado ainda" : "Nenhum depósito encontrado"}
                  </p>
                  {depositos.length === 0 && (
                    <Button onClick={() => setIsCreateDialogOpen(true)}>Criar Primeiro Depósito</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredDepositos.map((deposito) => (
              <div key={deposito._id} onClick={() => setSelectedDeposito(deposito)}>
                <DepositoCard
                  deposito={deposito}
                  onGenerateSuggestions={handleGenerateSuggestions}
                  onEdit={() => {}} // TODO: Implementar edição
                  onDelete={handleDeleteDeposito}
                  isGenerating={isGenerating === deposito._id}
                />
              </div>
            ))
          )}
        </div>

        {/* Painel de Sugestões */}
        <div className="lg:sticky lg:top-4">
          {selectedDeposito ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{selectedDeposito.nome}</CardTitle>
                  <CardDescription>{selectedDeposito.descricao}</CardDescription>
                </CardHeader>
              </Card>
              <SuggestionsDisplay deposito={selectedDeposito} />
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <div className="text-center space-y-2">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground">Selecione um depósito para ver as sugestões</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Dialog de Criação */}
      <CreateDepositoDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateDeposito={handleCreateDeposito}
        ingredientesDisponiveis={ingredientesDisponiveis}
        userEmail={userEmail}
      />
    </div>
  )
}
