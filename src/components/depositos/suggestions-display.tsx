"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChefHat, Clock, TrendingUp, Utensils, Lightbulb, Star, Users, Timer } from "lucide-react"
import type { IDeposito } from "@/model/deposito"

interface SuggestionsDisplayProps {
  deposito: IDeposito
}

const dificuldadeColors = {
  facil: "bg-green-100 text-green-800",
  medio: "bg-yellow-100 text-yellow-800",
  dificil: "bg-red-100 text-red-800",
}

const tipoRefeicaoColors = {
  "cafe-da-manha": "bg-orange-100 text-orange-800",
  almoco: "bg-blue-100 text-blue-800",
  "lanche-da-tarde": "bg-purple-100 text-purple-800",
  janta: "bg-indigo-100 text-indigo-800",
}

export function SuggestionsDisplay({ deposito }: SuggestionsDisplayProps) {
  const { sugestoes_geradas } = deposito

  if (!sugestoes_geradas || (sugestoes_geradas.receitas.length === 0 && sugestoes_geradas.refeicoes.length === 0)) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center space-y-2">
            <ChefHat className="h-12 w-12 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground">Nenhuma sugestão gerada ainda</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Receitas */}
      {sugestoes_geradas.receitas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="h-5 w-5 text-orange-600" />
              Receitas Sugeridas ({sugestoes_geradas.receitas.length})
            </CardTitle>
            <CardDescription>Receitas criadas especialmente com seus ingredientes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {sugestoes_geradas.receitas.map((receita, index) => (
              <Card key={index} className="border-l-4 border-l-orange-500">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{receita.nome}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={dificuldadeColors[receita.dificuldade]}>{receita.dificuldade}</Badge>
                        <Badge variant="outline">
                          <Timer className="h-3 w-3 mr-1" />
                          {receita.tempo_preparo} min
                        </Badge>
                        <Badge variant="outline">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {receita.calorias_estimadas} kcal
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Confiança</div>
                      <div className="text-lg font-bold text-green-600">{receita.confianca}%</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Ingredientes */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Ingredientes Principais:</h4>
                    <div className="flex flex-wrap gap-1">
                      {receita.ingredientes_usados.map((ing, i) => (
                        <Badge key={i} variant="secondary">
                          {ing}
                        </Badge>
                      ))}
                    </div>
                    {receita.ingredientes_extras && receita.ingredientes_extras.length > 0 && (
                      <>
                        <h4 className="font-medium text-sm">Ingredientes Extras:</h4>
                        <div className="flex flex-wrap gap-1">
                          {receita.ingredientes_extras.map((ing, i) => (
                            <Badge key={i} variant="outline">
                              {ing}
                            </Badge>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Macros */}
                  <div className="grid grid-cols-3 gap-4 p-3 bg-muted/50 rounded-lg">
                    <div className="text-center">
                      <div className="text-sm font-medium text-red-600">{receita.macros.proteinas}g</div>
                      <div className="text-xs text-muted-foreground">Proteínas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-blue-600">{receita.macros.carboidratos}g</div>
                      <div className="text-xs text-muted-foreground">Carboidratos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-yellow-600">{receita.macros.gorduras}g</div>
                      <div className="text-xs text-muted-foreground">Gorduras</div>
                    </div>
                  </div>

                  {/* Modo de Preparo */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Modo de Preparo:</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                      {receita.modo_preparo.map((passo, i) => (
                        <li key={i} className="text-muted-foreground">
                          {passo}
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Tags */}
                  {receita.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {receita.tags.map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Refeições */}
      {sugestoes_geradas.refeicoes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Utensils className="h-5 w-5 text-blue-600" />
              Refeições Sugeridas ({sugestoes_geradas.refeicoes.length})
            </CardTitle>
            <CardDescription>Ideias de refeições balanceadas com seus ingredientes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {sugestoes_geradas.refeicoes.map((refeicao, index) => (
              <Card key={index} className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{refeicao.nome}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={tipoRefeicaoColors[refeicao.tipo]}>{refeicao.tipo.replace("-", " ")}</Badge>
                        <Badge variant="outline">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {refeicao.calorias_estimadas} kcal
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Confiança</div>
                      <div className="text-lg font-bold text-green-600">{refeicao.confianca}%</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Ingredientes */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Ingredientes Principais:</h4>
                    <div className="flex flex-wrap gap-1">
                      {refeicao.ingredientes_principais.map((ing, i) => (
                        <Badge key={i} variant="secondary">
                          {ing}
                        </Badge>
                      ))}
                    </div>
                    {refeicao.ingredientes_complementares && refeicao.ingredientes_complementares.length > 0 && (
                      <>
                        <h4 className="font-medium text-sm">Ingredientes Complementares:</h4>
                        <div className="flex flex-wrap gap-1">
                          {refeicao.ingredientes_complementares.map((ing, i) => (
                            <Badge key={i} variant="outline">
                              {ing}
                            </Badge>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Macros */}
                  <div className="grid grid-cols-3 gap-4 p-3 bg-muted/50 rounded-lg">
                    <div className="text-center">
                      <div className="text-sm font-medium text-red-600">{refeicao.macros.proteinas}g</div>
                      <div className="text-xs text-muted-foreground">Proteínas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-blue-600">{refeicao.macros.carboidratos}g</div>
                      <div className="text-xs text-muted-foreground">Carboidratos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-yellow-600">{refeicao.macros.gorduras}g</div>
                      <div className="text-xs text-muted-foreground">Gorduras</div>
                    </div>
                  </div>

                  {/* Observações */}
                  {refeicao.observacoes && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">{refeicao.observacoes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Dicas Nutricionais */}
      {sugestoes_geradas.dicas_nutricionais.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
              Dicas Nutricionais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {sugestoes_geradas.dicas_nutricionais.map((dica, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Star className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{dica}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Combinações Sugeridas */}
      {sugestoes_geradas.combinacoes_sugeridas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              Combinações Sugeridas
            </CardTitle>
            <CardDescription>Combinações inteligentes de ingredientes para maximizar benefícios</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {sugestoes_geradas.combinacoes_sugeridas.map((combinacao, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-2">
                <div className="flex flex-wrap gap-1">
                  {combinacao.ingredientes.map((ing, i) => (
                    <Badge key={i} variant="secondary">
                      {ing}
                    </Badge>
                  ))}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-purple-700">{combinacao.beneficio}</p>
                  <p className="text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 inline mr-1" />
                    {combinacao.quando_consumir}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
