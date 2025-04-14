"use client"

import { useState, useEffect, useMemo, SetStateAction } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Utensils, Coffee, Salad, Cookie, ChefHat, Flame, Edit, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"

import type { IRefeicao, nutridesc, RefeicaoTipo } from "@/model/refeicao"
import { Toaster } from "@/components/ui/toaster"
import { createMeal, getMeals, deleteMeal, updateMeal, getProfile } from "@/services/v1"
import bcrypt from "bcryptjs"
import type { IUser } from "@/model/users"

export default function Main() {
  const [meals, setMeals] = useState<IRefeicao[]>([])
  const [email, setEmail] = useState<IUser["email"] | string>("")
  const [currentFilter, setCurrentFilter] = useState<RefeicaoTipo | "todos">("todos")

  const [dialogState, setDialogState] = useState({
    isAddOpen: false,
    isEditOpen: false,
  })
  const [currentMeal, setCurrentMeal] = useState<IRefeicao | null>(null)

  const [newMeal, setNewMeal] = useState<Omit<IRefeicao, "_id">>({
    useremail: email,
    refid: "",
    nome: "",
    favorito: false,
    desc: {
      proteinas: "",
      carboidratos: "",
      gorduras: "",
      extra: {},
    },
    calorias: 0,
    data: new Date().toISOString().slice(0, 16),
    tipo: "cafe-da-manha",
  })

  const filteredMeals = useMemo(() => {
    return currentFilter === "todos" ? meals : meals.filter((meal) => meal.tipo === currentFilter)
  }, [meals, currentFilter])

  const totalcalorias = useMemo(() => {
    return meals.reduce((total, meal) => {
      const mealDate = new Date(meal.data).toDateString()
      const today = new Date().toDateString()

      if (mealDate === today) {
        return total + meal.calorias
      }
      return total
    }, 0)
  }, [meals])

  useEffect(() => {
    const getUser = async () => {
      const profile = await getProfile()
      const email = await profile.email
      setEmail(email)
      setNewMeal((prev) => ({ ...prev, useremail: email }))
    }
    getUser()

    const getMeal = async () => {
      const meals = await getMeals()
      setMeals(meals)
    }
    getMeal()
  }, [])

  const updateRefeicaoNova = (updates: Omit<IRefeicao, "_id">) => {
    setNewMeal((prev) => ({ ...prev, ...updates }))
  }

  const updateRefeicaoNovaDesc = (updates: nutridesc) => {
    setNewMeal((prev) => ({
      ...prev,
      desc: { ...prev.desc, ...updates },
    }))
  }

  const updateRefeicaoNovaExtra = (key: string, value: string) => {
    setNewMeal((prev) => ({
      ...prev,
      desc: {
        ...prev.desc,
        extra: {
          ...prev.desc.extra,
          [key]: value,
        },
      },
    }))
  }

  const updateRefeicaoAtualExtra = (key: string, value: string) => {
    if (!currentMeal) return
    setCurrentMeal(((prev) => {
      if (!prev) return null;
      return {...prev, desc: {...prev.desc,extra: {...prev.desc.extra,[key]: value,},
      },
    }}))
  }

  const removeRefeicaoNovaExtra = (key: string) => {
    setNewMeal((prev) => {
      const newExtra = { ...prev.desc.extra }
      delete newExtra[key]
      return {
        ...prev,
        desc: {
          ...prev.desc,
          extra: newExtra,
        },
      }
    })
  }

  const addNewExtraField = () => {
    setNewMeal((prev) => ({
      ...prev,
      desc: {
        ...prev.desc,
        extra: {
          ...prev.desc.extra,
          [`novo-campo-${Date.now()}`]: "",
        },
      },
    }))
  }

  const updateRefeicaoAtual = (updates: SetStateAction<IRefeicao | null>) => {
    if (!currentMeal) return
    setCurrentMeal((prev) => {
      if (!prev) return null; 
      return { ...currentMeal, ...updates }})
  }

  const updateRefeicaoAtualDesc = (updates: nutridesc) => {
    if (!currentMeal) return
    setCurrentMeal((prev) => {
      if (!prev) return null; 

      return {...currentMeal,desc: { ...currentMeal.desc, ...updates }}})
  }

  const removeRefeicaoAtualExtra = (key: string) => {
    if (!currentMeal) return;
    setCurrentMeal((prev) => {
        if (!prev) return null;
        const newExtra = { ...prev.desc.extra };
        delete newExtra[key];
        return {
            ...prev,
            desc: {
                ...prev.desc,
                extra: newExtra,
            },
        };
    });
};

const addCurrentExtraField = () => {
  if (!currentMeal) return;
  
  setCurrentMeal((prev) => {
    if (!prev) return null;
    
    return {
      ...prev,
      desc: {
        ...prev.desc,
        extra: {
          ...prev.desc.extra,
          [`campo-${Date.now()}`]: "",
        },
      },
    };
  });
};

  const handleAddMeal = async () => {
    const newId = await bcrypt.genSalt(18)
    const mealToAdd = {
      ...newMeal,
      refid: newId,
      useremail: email,
    }

    setMeals([...meals, mealToAdd])
    setDialogState({ ...dialogState, isAddOpen: false })

    setNewMeal({
      useremail: email,
      refid: "",
      nome: "",
      favorito: false,
      desc: {
        proteinas: "",
        carboidratos: "",
        gorduras: "",
        extra: {},
      },
      calorias: 0,
      data: new Date().toISOString().slice(0, 16),
      tipo: "cafe-da-manha",
    })

    toast({
      title: "Refeição adicionada",
      description: "Sua refeição foi adicionada com sucesso.",
    })

    try {
      const response = await createMeal(mealToAdd)
    } catch (error) {
      console.error("Erro ao criar refeição:", error)
    }
  }

  const handleEditMeal = async () => {
    if (!currentMeal) {
      toast({
        title: "Erro",
        description: "Nenhuma refeição selecionada para edição",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await updateMeal(currentMeal)
      setMeals(meals.map((meal) => (meal.refid === currentMeal.refid ? currentMeal : meal)))
      setDialogState({ ...dialogState, isEditOpen: false })
      setCurrentMeal(null)

      toast({
        title: "Refeição atualizada",
        description: "Sua refeição foi atualizada com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao atualizar refeição:", error)
    }
  }

  const handleDeleteMeal = async (id: string) => {
    try {
      const updatedMeals = meals.filter((meal) => meal.refid !== id)
      const deletedMeals = meals.filter((meal) => meal.refid === id)

      for (const meal of deletedMeals) {
        await deleteMeal(meal)
      }

      setMeals(updatedMeals)
      toast({
        title: "Refeição removida",
        description: "Sua refeição foi removida com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao deletar refeição:", error)
    }
  }

  const getMealTypeIcon = (type: RefeicaoTipo) => {
    switch (type) {
      case "cafe-da-manha":
        return <Coffee className="h-5 w-5" />
      case "almoco":
        return <Salad className="h-5 w-5" />
      case "lanche-da-tarde":
        return <Cookie className="h-5 w-5" />
      case "janta":
        return <ChefHat className="h-5 w-5" />
      default:
        return <Utensils className="h-5 w-5" />
    }
  }

  const getMealTypeName = (type: RefeicaoTipo) => {
    switch (type) {
      case "cafe-da-manha":
        return "Café da manhã"
      case "almoco":
        return "Almoço"
      case "lanche-da-tarde":
        return "Lanche da tarde"
      case "janta":
        return "Janta"
      default:
        return "Refeição"
    }
  }

  return (
    <div className="container py-6 px-4 md:px-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Bem vindo! {email}</h1>
            <p className="text-muted-foreground">Gerencie suas refeições e acompanhe suas calorias diárias.</p>
          </div>
          <Dialog
            open={dialogState.isAddOpen}
            onOpenChange={(open) => setDialogState({ ...dialogState, isAddOpen: open })}
          >
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="mr-2 h-4 w-4" /> Adicionar Refeição
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>Adicionar Nova Refeição</DialogTitle>
                <DialogDescription>Preencha os detalhes da sua refeição abaixo.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4 overflow-y-auto pr-2">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={newMeal.nome}
                    onChange={(e) => updateRefeicaoNova({...newMeal, nome: e.target.value })}
                    placeholder="Ex: Salada com frango grelhado"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Informações Nutricionais</Label>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label>Proteínas (g)</Label>
                      <Input
                        value={newMeal.desc.proteinas}
                        onChange={(e) => updateRefeicaoNovaDesc({ proteinas: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Carboidratos (g)</Label>
                      <Input
                        value={newMeal.desc.carboidratos}
                        onChange={(e) => updateRefeicaoNovaDesc({ carboidratos: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Gorduras (g)</Label>
                      <Input
                        value={newMeal.desc.gorduras}
                        onChange={(e) => updateRefeicaoNovaDesc({ gorduras: e.target.value })}
                      />
                    </div>

                    {Object.entries(newMeal.desc.extra || {}).map(([key, value], index) => (
                      <div key={index} className="grid grid-cols-3 gap-2 items-end">
                        <div className="grid gap-2">
                          <Label>Nome</Label>
                          <Input
                            value={key}
                            onChange={(e) => {
                              const newKey = e.target.value
                              const newValue = value
                              removeRefeicaoNovaExtra(key)
                              updateRefeicaoNovaExtra(newKey, newValue)
                            }}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label>Valor</Label>
                          <Input value={value} onChange={(e) => updateRefeicaoNovaExtra(key, e.target.value)} />
                        </div>
                        <Button variant="destructive" onClick={() => removeRefeicaoNovaExtra(key)}>
                          Remover
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" onClick={addNewExtraField}>
                      Adicionar Campo Extra
                    </Button>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="calorias">Calorias</Label>
                  <Input
                    id="calorias"
                    type="number"
                    value={newMeal.calorias || ""}
                    onChange={(e) => updateRefeicaoNova({...newMeal, calorias: Number.parseInt(e.target.value) || 0 })}
                    placeholder="Ex: 350"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="datetime">Data e Hora</Label>
                  <Input
                    id="datetime"
                    type="datetime-local"
                    value={IsoStringToDate(newMeal.data)}
                    onChange={(e) => updateRefeicaoNova({...newMeal, data: dateToIsoString(e.target.value) })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Tipo de Refeição</Label>
                  <Select
                    value={newMeal.tipo}
                    onValueChange={(value) => updateRefeicaoNova({...newMeal, tipo: value as RefeicaoTipo })}
                  >
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
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogState({ ...dialogState, isAddOpen: false })}>
                  Cancelar
                </Button>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={handleAddMeal}
                  disabled={!newMeal.nome || !newMeal.calorias}
                >
                  Adicionar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Calorias Hoje</CardTitle>
              <Flame className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalcalorias} kcal</div>
              <p className="text-xs text-muted-foreground">
                {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Refeições Hoje</CardTitle>
              <Flame className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{meals.length} Refeições </div>
              <p className="text-xs text-muted-foreground">
                {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
              </p>
            </CardContent>
          </Card>
        </div>
        <Tabs
          defaultValue="todos"
          className="w-full"
          onValueChange={(value) => setCurrentFilter(value as RefeicaoTipo | "todos")}
        >
          <TabsList className="mb-4">
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="cafe-da-manha">Café da manhã</TabsTrigger>
            <TabsTrigger value="almoco">Almoço</TabsTrigger>
            <TabsTrigger value="lanche-da-tarde">Lanche</TabsTrigger>
            <TabsTrigger value="janta">Janta</TabsTrigger>
          </TabsList>
          <TabsContent value="todos" className="space-y-4">
            <h2 className="text-xl font-semibold">Todas as Refeições</h2>
            {filteredMeals.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <Utensils className="h-10 w-10 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center">Nenhuma refeição encontrada.</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setDialogState({ ...dialogState, isAddOpen: true })}
                  >
                    Adicionar Refeição
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredMeals.map((meal) => (
                  <MealCard
                    key={meal.refid}
                    meal={meal}
                    onEdit={(meal) => {
                      setCurrentMeal(meal)
                      setDialogState({ ...dialogState, isEditOpen: true })
                    }}
                    onDelete={handleDeleteMeal}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          {["cafe-da-manha", "almoco", "lanche-da-tarde", "janta"].map((type) => (
            <TabsContent key={type} value={type} className="space-y-4">
              <h2 className="text-xl font-semibold">{getMealTypeName(type as RefeicaoTipo)}</h2>
              {filteredMeals.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    {getMealTypeIcon(type as RefeicaoTipo)}
                    <p className="text-muted-foreground text-center mt-4">
                      Nenhuma refeição do tipo {getMealTypeName(type as RefeicaoTipo)} encontrada.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => {
                        updateRefeicaoNova({...newMeal, tipo: type as RefeicaoTipo })
                        setDialogState({ ...dialogState, isAddOpen: true })
                      }}
                    >
                      Adicionar {getMealTypeName(type as RefeicaoTipo)}
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredMeals.map((meal) => (
                    <MealCard
                      key={meal.refid}
                      meal={meal}
                      onEdit={(meal) => {
                        setCurrentMeal(meal)
                        setDialogState({ ...dialogState, isEditOpen: true })
                      }}
                      onDelete={handleDeleteMeal}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <Dialog
        open={dialogState.isEditOpen}
        onOpenChange={(open) => setDialogState({ ...dialogState, isEditOpen: open })}
      >
        <DialogContent className="max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Editar Refeição</DialogTitle>
            <DialogDescription>Atualize os detalhes da sua refeição.</DialogDescription>
          </DialogHeader>
          {currentMeal && (
            <div className="grid gap-4 py-4 overflow-y-auto pr-2">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Nome</Label>
                <Input
                  id="edit-name"
                  value={currentMeal.nome}
                  onChange={(e) => updateRefeicaoAtual({...currentMeal, nome: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-desc">Descrição Nutricional</Label>
                <Label htmlFor="edit-gordura">Gordura</Label>
                <Textarea
                  id="edit-gordura"
                  value={currentMeal.desc.gorduras}
                  onChange={(e) => updateRefeicaoAtualDesc({ gorduras: e.target.value })}
                />
                <Label htmlFor="edit-prot">Proteina</Label>
                <Textarea
                  id="edit-prot"
                  value={currentMeal.desc.proteinas}
                  onChange={(e) => updateRefeicaoAtualDesc({ proteinas: e.target.value })}
                />
                <Label htmlFor="edit-carb">Carboidrato</Label>
                <Textarea
                  id="edit-carb"
                  value={currentMeal.desc.carboidratos}
                  onChange={(e) => updateRefeicaoAtualDesc({ carboidratos: e.target.value })}
                />
              </div>
              {Object.entries(currentMeal.desc.extra || {}).map(([extraKey, extraValue], index) => (
                <div key={index} className="grid grid-cols-3 gap-2 items-end">
                  <div className="grid gap-2">
                    <Label>Nome</Label>
                    <Input
                      value={extraKey}
                      onChange={(e) => {
                        const newKey = e.target.value
                        const newValue = extraValue
                        removeRefeicaoAtualExtra(extraKey)
                        updateRefeicaoAtualExtra(newKey, newValue)
                      }}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Valor</Label>
                    <Input value={extraValue} onChange={(e) => updateRefeicaoAtualExtra(extraKey, e.target.value)} />
                  </div>
                  <Button variant="destructive" onClick={() => removeRefeicaoAtualExtra(extraKey)}>
                    Remover
                  </Button>
                </div>
              ))}

              <Button variant="outline" onClick={addCurrentExtraField}>
                Adicionar Campo Extra
              </Button>
              <div className="grid gap-2">
                <Label htmlFor="edit-calorias">Calorias</Label>
                <Input
                  id="edit-calorias"
                  type="number"
                  value={currentMeal.calorias || ""}
                  onChange={(e) => updateRefeicaoAtual({...currentMeal,  calorias: Number.parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-datetime">Data e Hora</Label>
                <Input
                  id="edit-datetime"
                  type="datetime-local"
                  value={IsoStringToDate(currentMeal.data)}
                  onChange={(e) => updateRefeicaoAtual({...currentMeal, data: dateToIsoString(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-type">Tipo de Refeição</Label>
                <Select
                  value={currentMeal.tipo}
                  onValueChange={(value) => updateRefeicaoAtual({...currentMeal,  tipo: value as RefeicaoTipo })}
                >
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
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogState({ ...dialogState, isEditOpen: false })}>
              Cancelar
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={handleEditMeal}
              disabled={!currentMeal?.nome || !currentMeal?.calorias}
            >
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  )
}

interface MealCardProps {
  meal: IRefeicao
  onEdit: (meal: IRefeicao) => void
  onDelete: (id: string) => void
}

function MealCard({ meal, onEdit, onDelete }: MealCardProps) {
  const mealDate = new Date(meal.data)
  const formattedDate = format(mealDate, "dd 'de' MMMM", { locale: ptBR })
  const formattedTime = format(mealDate, "HH:mm")

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-emerald-100 p-1 dark:bg-emerald-900">{getMealTypeIcon(meal.tipo)}</div>
            <CardTitle>{meal.nome}</CardTitle>
          </div>
          <Badge variant="outline" className="ml-2">
            {getMealTypeName(meal.tipo)}
          </Badge>
        </div>
        {meal.desc && Object.keys(meal.desc).length > 0 && (
          <>
            {meal.desc.carboidratos !== undefined && (
              <CardDescription>Carboidratos: {meal.desc.carboidratos}g</CardDescription>
            )}
            {meal.desc.proteinas !== undefined && <CardDescription>Proteínas: {meal.desc.proteinas}g</CardDescription>}
            {meal.desc.gorduras !== undefined && <CardDescription>Gorduras: {meal.desc.gorduras}g</CardDescription>}
            {meal.desc.extra && typeof meal.desc.extra === "object" && (
              <>
                {Object.entries(meal.desc.extra).map(([extraKey, extraValue], index) => (
                  <CardDescription key={`extra-${index}`}>
                    {extraKey}: {extraValue}g
                  </CardDescription>
                ))}
              </>
            )}
          </>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {formattedDate} às {formattedTime}
          </div>
          <div className="flex items-center gap-1">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="font-medium">{meal.calorias} kcal</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(meal)}>
          <Edit className="h-4 w-4 mr-1" /> Editar
        </Button>
        <Button variant="outline" size="sm" className="text-red-500" onClick={() => onDelete(meal.refid)}>
          <Trash2 className="h-4 w-4 mr-1" /> Excluir
        </Button>
      </CardFooter>
    </Card>
  )
}

function getMealTypeIcon(type: RefeicaoTipo) {
  switch (type) {
    case "cafe-da-manha":
      return <Coffee className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
    case "almoco":
      return <Salad className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
    case "lanche-da-tarde":
      return <Cookie className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
    case "janta":
      return <ChefHat className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
    default:
      return <Utensils className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
  }
}

function IsoStringToDate(isoString: string) {
  const date = new Date(isoString)

  const offset = date.getTimezoneOffset() * 60000
  const localDate = new Date(date.getTime() - offset)

  return localDate.toISOString().slice(0, 16)
}

function dateToIsoString(date: string) {
  return new Date(date).toISOString()
}

function getMealTypeName(type: RefeicaoTipo) {
  switch (type) {
    case "cafe-da-manha":
      return "Café da manhã"
    case "almoco":
      return "Almoço"
    case "lanche-da-tarde":
      return "Lanche da tarde"
    case "janta":
      return "Janta"
    default:
      return "Refeição"
  }
}
