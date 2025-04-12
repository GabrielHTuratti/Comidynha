"use client"

import { useState, useEffect } from "react"
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
import { Toast } from "@/components/ui/toast"

import {IRefeicao, RefeicaoTipo, nutridesc } from "@/model/refeicao"
import { Toaster } from "@/components/ui/toaster"
import { createMeal, getMeals, deleteMeal, updateMeal, getProfile } from "@/services/v1"
import bcrypt from "bcryptjs"

export default function Main() {
  const user = await getProfile();
  const [meals, setMeals] = useState<IRefeicao[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentFilter, setCurrentFilter] = useState<RefeicaoTipo | "todos">("todos")
  const [currentMeal, setCurrentMeal] = useState<IRefeicao | null>(null)
  const [newMeal, setNewMeal] = useState<Omit<IRefeicao, "_id">>({
    userid: ,
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

  const [campoExtra, setCampoExtra] = useState<{key: string, value: string}[]>([])
  const [currentCampoExtra, setCurrentCampoExtra] = useState<{key: string, value: string}[]>([]);

  const [nutriDesc, setNutriDesc] = useState<nutridesc>({
    proteinas: "",
    carboidratos: "",
    gorduras: "",
    extra: {}
  });

  const [currentNutriDesc, setCurrentNutriDesc] = useState<nutridesc>({
    proteinas: "",
    carboidratos: "",
    gorduras: "",
    extra: {}
  });

  useEffect(() => {
   const getMeal = async () => {
      const meals = await getMeals();
      console.log(meals);
      setMeals(meals);
   }
  getMeal()
  }, [])

  const filteredMeals = currentFilter === "todos" ? meals : meals.filter((meal) => meal.tipo === currentFilter)

  const totalcalorias = meals.reduce((total, meal) => {
    const mealDate = new Date(meal.data).toDateString()
    const today = new Date().toDateString()

    if (mealDate === today) {
      return total + meal.calorias
    }
    return total
  }, 0)
  const handleAddMeal = async () => {
    const newId = await bcrypt.genSalt(18);
    const mealToAdd = { 
      ...newMeal, 
      refid: newId,
      desc: {
        proteinas: nutriDesc.proteinas,
        carboidratos: nutriDesc.carboidratos,
        gorduras: nutriDesc.gorduras,
        extra: campoExtra.reduce((acc, field) => ({...acc, [field.key]: field.value}), {})
      }
    }
    setMeals([...meals, mealToAdd])
    setIsAddDialogOpen(false)
    setCampoExtra([]);
    setNutriDesc({
      proteinas: "",
      carboidratos: "",
      gorduras: "",
      extra: {}
    });
    setNewMeal({
      refid: "",
      nome: "",
      favorito: false,
      desc: nutriDesc,
      calorias: 0,
      data: new Date().toISOString().slice(0, 16),
      tipo: "cafe-da-manha",
    })
    toast({
      title: "Refeição adicionada",
      description: "Sua refeição foi adicionada com sucesso.",
    })    
    alert(`tentando criar...! ${mealToAdd}`);
    const response = await createMeal(mealToAdd);
    alert(`Criado com sucesso! ${response}`);
  }

  const handleEditMeal = async () => {
    if (!currentMeal) {
      toast({
        title: "Erro",
        description: "Nenhuma refeição selecionada para edição",
        variant: "destructive"
      });
      return;
    }

    const mealToUpdate = {
      ...currentMeal,
      desc: {
        ...currentMeal.desc,
        extra: currentCampoExtra.reduce((acc, field) => ({ 
          ...acc, 
          [field.key]: field.value 
        }), {})
      }
    };
    console.log(mealToUpdate)
    const response = await updateMeal(mealToUpdate);
    alert(response.status);
    setMeals(meals.map(meal => 
      meal.refid === currentMeal.refid ? currentMeal : meal
    ));
    setIsEditDialogOpen(false)
    setCurrentMeal(null)
    toast({
      title: "Refeição atualizada",
      description: "Sua refeição foi atualizada com sucesso.",
    })
  }

  const handleDeleteMeal = async (id: string) => {
    const updatedMeals = meals.filter((meal) => meal.refid !== id)
    const deletedMeals = meals.filter((meal) => meal.refid === id);
    deletedMeals.forEach(async (meal) => {
      const response = await deleteMeal(meal);
      alert(response);
    })
    console.log("itens não deletados:" + updatedMeals);
    setMeals(updatedMeals)
    toast({
      title: "Refeição removida",
      description: "Sua refeição foi removida com sucesso.",
    })

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

  const handleAddDescExtra = () => {
    //
  }


  return (
    <div className="container py-6 px-4 md:px-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Principal</h1>
            <p className="text-muted-foreground">Gerencie suas refeições e acompanhe suas calorias diárias.</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
                    onChange={(e) => setNewMeal({ ...newMeal, nome: e.target.value })}
                    placeholder="Ex: Salada com frango grelhado"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Informações Nutricionais</Label>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label>Proteínas (g)</Label>
                      <Input
                        value={nutriDesc.proteinas}
                        onChange={(e) => setNutriDesc({...nutriDesc, proteinas: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Carboidratos (g)</Label>
                      <Input
                        value={nutriDesc.carboidratos}
                        onChange={(e) => setNutriDesc({...nutriDesc, carboidratos: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Gorduras (g)</Label>
                      <Input
                        value={nutriDesc.gorduras}
                        onChange={(e) => setNutriDesc({...nutriDesc, gorduras: e.target.value})}
                      />
                    </div>
                    
                    {campoExtra.map((field, index) => (
                      <div key={index} className="grid grid-cols-3 gap-2 items-end">
                        <div className="grid gap-2">
                          <Label>Nome</Label>
                          <Input
                            value={field.key}
                            onChange={(e) => {
                              const updated = [...campoExtra];
                              updated[index].key = e.target.value;
                              setCampoExtra(updated);
                            }}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label>Valor</Label>
                          <Input
                            value={field.value}
                            onChange={(e) => {
                              const updated = [...campoExtra];
                              updated[index].value = e.target.value;
                              setCampoExtra(updated);
                            }}
                          />
                        </div>
                        <Button 
                          variant="destructive" 
                          onClick={() => setCampoExtra(campoExtra.filter((_, i) => i !== index))}
                        >
                          Remover
                        </Button>
                      </div>
                    ))}
                    
                    <Button 
                      variant="outline" 
                      onClick={() => setCampoExtra([...campoExtra, {key: '', value: ''}])}
                    >
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
                    onChange={(e) => setNewMeal({ ...newMeal, calorias: Number.parseInt(e.target.value) || 0 })}
                    placeholder="Ex: 350"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="datetime">Data e Hora</Label>
                  <Input
                    id="datetime"
                    type="datetime-local"
                    value={newMeal.data}
                    onChange={(e) => setNewMeal({ ...newMeal, data: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Tipo de Refeição</Label>
                  <Select
                    value={newMeal.tipo}
                    onValueChange={(value) => setNewMeal({ ...newMeal, tipo: value as RefeicaoTipo })}
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
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
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
                  <Button variant="outline" className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
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
                      setIsEditDialogOpen(true)
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
                        setNewMeal({ ...newMeal, tipo: type as RefeicaoTipo })
                        setIsAddDialogOpen(true)
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
                        setIsEditDialogOpen(true)
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

      {}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
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
                  onChange={(e) => setCurrentMeal({ ...currentMeal, nome: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
              <Label htmlFor="edit-desc">Descrição Nutricional</Label>
                <Label htmlFor="edit-gordura">Gordura</Label>
                <Textarea
                  id="edit-gordura"
                  value={currentNutriDesc.gorduras}
                  onChange={(e) => setCurrentNutriDesc({ ...currentNutriDesc, gorduras: e.target.value })}
                />
                <Label htmlFor="edit-prot">Proteina</Label>
                <Textarea
                  id="edit-prot"
                  value={currentNutriDesc.proteinas}
                  onChange={(e) => setCurrentNutriDesc({ ...currentNutriDesc, proteinas: e.target.value })}
                />
                <Label htmlFor="edit-carb">Carboidrato</Label>
                <Textarea
                  id="edit-carb"
                  value={currentNutriDesc.carboidratos}
                  onChange={(e) => setCurrentNutriDesc({ ...currentNutriDesc, carboidratos: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-calorias">Calorias</Label>
                <Input
                  id="edit-calorias"
                  type="number"
                  value={currentMeal.calorias || ""}
                  onChange={(e) => setCurrentMeal({ ...currentMeal, calorias: Number.parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-datetime">Data e Hora</Label>
                <Input
                  id="edit-datetime"
                  type="datetime-local"
                  value={currentMeal.data}
                  onChange={(e) => setCurrentMeal({ ...currentMeal, data: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-type">Tipo de Refeição</Label>
                <Select
                  value={currentMeal.tipo}
                  onValueChange={(value) => setCurrentMeal({ ...currentMeal, tipo: value as RefeicaoTipo })}
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
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
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

      <Toaster/>
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
        <CardDescription>{meal.desc.carboidratos}</CardDescription>
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
