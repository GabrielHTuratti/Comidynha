"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChefHat, Target, Calendar, Sparkles, Settings, Trash2, Clock, Users } from "lucide-react"
import { DepositoCardProps } from "@/types/intelligent-meal"

const objetivoLabels = {
  "ganho-muscular": "Ganho Muscular",
  "perda-peso": "Perda de Peso",
  manutencao: "Manutenção",
  "receitas-doces": "Receitas Doces",
  "jantar-romantico": "Jantar Romântico",
  "almoco-rapido": "Almoço Rápido",
  "cafe-da-manha": "Café da Manhã",
  "lanche-saudavel": "Lanche Saudável",
  "comida-vegana": "Comida Vegana",
  "low-carb": "Low Carb",
  "dieta-mediterranea": "Dieta Mediterrânea",
  personalizado: "Personalizado",
}

const objetivoColors = {
  "ganho-muscular": "bg-red-100 text-red-800",
  "perda-peso": "bg-green-100 text-green-800",
  manutencao: "bg-blue-100 text-blue-800",
  "receitas-doces": "bg-pink-100 text-pink-800",
  "jantar-romantico": "bg-purple-100 text-purple-800",
  "almoco-rapido": "bg-orange-100 text-orange-800",
  "cafe-da-manha": "bg-yellow-100 text-yellow-800",
  "lanche-saudavel": "bg-emerald-100 text-emerald-800",
  "comida-vegana": "bg-lime-100 text-lime-800",
  "low-carb": "bg-indigo-100 text-indigo-800",
  "dieta-mediterranea": "bg-cyan-100 text-cyan-800",
  personalizado: "bg-gray-100 text-gray-800",
}

export function DepositoCard({
  deposito,
  onGenerateSuggestions,
  onEdit,
  onDelete,
  isGenerating = false,
}: DepositoCardProps) {
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const temSugestoes = deposito.sugestoes_geradas? deposito.sugestoes_geradas.receitas.length > 0 || deposito.sugestoes_geradas.refeicoes.length > 0 : 0
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="h-5 w-5 text-orange-600" />
              {deposito.nome}
            </CardTitle>
            <CardDescription className="line-clamp-2">{deposito.descricao}</CardDescription>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => onEdit(deposito)}>
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(deposito._id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Badge className={objetivoColors[deposito.objetivo]}>
            <Target className="h-3 w-3 mr-1" />
            {objetivoLabels[deposito.objetivo]}
          </Badge>
          <Badge variant="outline">
            <Users className="h-3 w-3 mr-1" />
            {deposito.ingredientes.length} ingredientes
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Estatísticas */}
        {temSugestoes && (
          <div className="grid grid-cols-3 gap-4 p-3 bg-muted/50 rounded-lg">
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">{deposito.sugestoes_geradas.receitas.length}</div>
              <div className="text-xs text-muted-foreground">Receitas</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{deposito.sugestoes_geradas.refeicoes.length}</div>
              <div className="text-xs text-muted-foreground">Refeições</div>
            </div>
          </div>
        )}

        {/* Ingredientes Preview */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Ingredientes:</div>
          <div className="flex flex-wrap gap-1">
            {deposito.ingredientes.slice(0, 6).map((ingrediente) => (
              <Badge key={`ing-${ingrediente.refid}`} variant="outline" className="text-xs">
                {ingrediente.nome}
              </Badge>
            ))}
            {deposito.ingredientes.length > 6 && (
              <Badge variant="outline" className="text-xs">
                +{deposito.ingredientes.length - 6} mais
              </Badge>
            )}
          </div>
        </div>

        {/* Última Sugestão */}
        {deposito.ultima_sugestao && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            Última sugestão: {formatDate(deposito.ultima_sugestao)}
          </div>
        )}

        {/* Botão Principal */}
        <Button
          onClick={() => onGenerateSuggestions(deposito._id)}
          disabled={isGenerating}
          className="w-full"
          variant={temSugestoes ? "outline" : "default"}
        >
          {isGenerating ? (
            <>
              <Sparkles className="h-4 w-4 mr-2 animate-spin" />
              Gerando Sugestões...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              {temSugestoes ? "Gerar Novas Sugestões" : "Gerar Sugestões"}
            </>
          )}
        </Button>

        {/* Data de Criação */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
          <Calendar className="h-3 w-3" />
          Criado em {formatDate(deposito.data_criacao)}
        </div>
      </CardContent>
    </Card>
  )
}
