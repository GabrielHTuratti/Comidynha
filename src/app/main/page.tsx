"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, TrendingUp, Target, Calendar, Award, Sparkles, ChefHat } from "lucide-react"
import { toast } from "sonner"
import { MealTabs } from "@/components/refeicao/refeicao-tabs"
import { AddMealDialog } from "@/components/refeicao/add-refeicao-dialog"
import { EditMealDialog } from "@/components/refeicao/edit-refeicao-dialog"
import { IntelligentMealForm } from "@/components/intelligent-meal/intelligent-meal-form"
import { NutritionAnalytics } from "@/components/analytics/nutrition-analytics"
import { WeeklyProgress } from "@/components/analytics/weekly-progress"
import { MonthlyTrends } from "@/components/analytics/monthly-trends"
import { GoalsTracking } from "@/components/analytics/goals-tracking"
import { createMeal, getMeals, deleteMeal, updateMeal, getProfile } from "@/services/v1"
import bcrypt from "bcryptjs"
import type { IRefeicao, nutridesc, RefeicaoTipo } from "@/model/refeicao"
import type { IUser } from "@/model/users"
import { handleDeletarRefeicao } from "@/components/cliente/handleDeletarRefeicao"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import IngredientDetector from "@/components/ingredientes/ingredient-detector"
import { DepositosManager } from "@/components/depositos/depositos-manager"

export default function Main() {
  const [meals, setRefeicao] = useState<IRefeicao[]>([])
  const [email, setEmail] = useState<IUser["email"] | string>("")
  const [name, setName] = useState<IUser["name"] | string>("")
  const [plano, setPlano] = useState<IUser["plan"] | string>("Basico")

  // Estados para expansão das seções
  const [expandedSections, setExpandedSections] = useState({
    analytics: false,
    progress: false,
    trends: false,
    goals: false,
    ingredients: false,
    deposits: false, // Adicionar esta linha
  })

  const [dialogState, setDialogState] = useState({
    isAddOpen: false,
    isEditOpen: false,
  })
  const [refeicaoAtual, setRefeicaoAtual] = useState<IRefeicao | null>(null)

  const [refeicaoNova, setRefeicaoNova] = useState<Omit<IRefeicao, "_id">>({
    useremail: email,
    refid: "",
    nome: "",
    confidence: undefined,
    ingredients: [],
    desc: {
      proteinas: "0",
      carboidratos: "0",
      gorduras: "0",
      extra: [{ campoid: "", nome: "", valor: "" }],
    },
    calorias: 0,
    data: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16),
    suggestions: [],
    tipo: "cafe-da-manha",
  })

  useEffect(() => {
    const getUser = async () => {
      const profile = await getProfile()
      const email = await profile.email
      // const limite = await profile.limit
      const plan = await profile.plan
      const nome = await profile.name
      setName(nome)
      setEmail(email)
      setPlano(plan)
      setRefeicaoNova((prev) => ({ ...prev, useremail: email }))
    }
    getUser()

    const getMeal = async () => {
      const meals = await getMeals()
      setRefeicao(meals)
    }
    getMeal()
  }, [])

  // Função para alternar expansão das seções
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Calcular estatísticas rápidas
  const todayMeals = meals.filter((meal) => {
    const today = new Date()
    const mealDate = new Date(meal.data)
    return mealDate.toDateString() === today.toDateString()
  })

  const todayCalories = todayMeals.reduce((total, meal) => total + meal.calorias, 0)
  const weekMeals = meals.filter((meal) => {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return new Date(meal.data) >= weekAgo
  })

  const avgDailyCalories =
    weekMeals.length > 0 ? Math.round(weekMeals.reduce((total, meal) => total + meal.calorias, 0) / 7) : 0

  const updateRefeicaoNova = (updates: Omit<IRefeicao, "_id">) => {
    setRefeicaoNova({ ...refeicaoNova, ...updates })
  }

  const updateRefeicaoNovaDesc = (newDesc: Partial<typeof refeicaoNova.desc>) => {
    setRefeicaoNova((prev) => ({
      ...prev,
      desc: {
        ...prev.desc,
        ...newDesc,
      },
    }))
  }

  const updateRefeicaoNovaExtra = (campoid: string, novoNome: string, novoValor: string) => {
    const novosExtras = (refeicaoNova.desc.extra || []).map((campo) =>
      campo.campoid === campoid ? { ...campo, nome: novoNome, valor: novoValor } : campo,
    )

    setRefeicaoNova({
      ...refeicaoNova,
      desc: {
        ...refeicaoNova.desc,
        extra: novosExtras,
      },
    })
  }

  const addNewExtraField = () => {
    const novoCampo = { campoid: Date.now().toString(), nome: "", valor: "" }

    setRefeicaoNova({
      ...refeicaoNova,
      desc: {
        ...refeicaoNova.desc,
        extra: [...(refeicaoNova.desc.extra || []), novoCampo],
      },
    })
  }

  const updateRefeicaoAtualExtra = (campoid: string, novoNome: string, novoValor: string) => {
    if (!refeicaoAtual) return

    const novosExtras = (refeicaoAtual.desc.extra || []).map((campo) =>
      campo.campoid === campoid ? { ...campo, nome: novoNome, valor: novoValor } : campo,
    )

    setRefeicaoAtual({
      ...refeicaoAtual,
      desc: {
        ...refeicaoAtual.desc,
        extra: novosExtras,
      },
    })
  }

  const removeRefeicaoNovaExtra = (campoid: string) => {
    const novosExtras = (refeicaoNova.desc.extra || []).filter((campo) => campo.campoid !== campoid)
    setRefeicaoNova({
      ...refeicaoNova,
      desc: {
        ...refeicaoNova.desc,
        extra: novosExtras,
      },
    })
  }

  const removeRefeicaoAtualExtra = (campoid: string) => {
    if (!refeicaoAtual) return

    const novosExtras = (refeicaoAtual.desc.extra || []).filter((campo) => campo.campoid !== campoid)

    setRefeicaoAtual({
      ...refeicaoAtual,
      desc: {
        ...refeicaoAtual.desc,
        extra: novosExtras,
      },
    })
  }

  const updateRefeicaoAtual = (updates: React.SetStateAction<IRefeicao | null>) => {
    if (!refeicaoAtual) return
    setRefeicaoAtual((prev) => {
      if (!prev) return null
      return { ...refeicaoAtual, ...updates }
    })
  }

  const updateRefeicaoAtualDesc = (updates: nutridesc) => {
    if (!refeicaoAtual) return
    setRefeicaoAtual((prev) => {
      if (!prev) return null

      return { ...refeicaoAtual, desc: { ...refeicaoAtual.desc, ...updates } }
    })
  }

  const addCurrentExtraField = () => {
    if (!refeicaoAtual) return

    const novoCampo = { campoid: Date.now().toString(), nome: "", valor: "" }

    setRefeicaoAtual({
      ...refeicaoAtual,
      desc: {
        ...refeicaoAtual.desc,
        extra: [...(refeicaoAtual.desc.extra || []), novoCampo],
      },
    })
  }

  const handleAddMeal = async () => {
    const newId = await bcrypt.genSalt(18)
    const mealToAdd = {
      ...refeicaoNova,
      refid: newId,
      useremail: email,
    }

    setRefeicao([...meals, mealToAdd])
    setDialogState({ ...dialogState, isAddOpen: false })

    // Reset form with new structure
    setRefeicaoNova({
      useremail: email,
      refid: "",
      nome: "",
      confidence: undefined,
      ingredients: [],
      desc: {
        proteinas: "0",
        carboidratos: "0",
        gorduras: "0",
        extra: [{ campoid: "", nome: "", valor: "" }],
      },
      calorias: 0,
      data: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16),
      suggestions: [],
      tipo: "cafe-da-manha",
    })

    toast.success("Refeição adicionada com sucesso!")

    try {
      await createMeal(mealToAdd)
    } catch (error) {
      console.error("Erro ao criar refeição:", error)
    }
  }

  const handleEditMeal = async () => {
    if (!refeicaoAtual) {
      toast.error("Nenhuma refeição selecionada para edição")
      return
    }

    try {
      await updateMeal(refeicaoAtual)
      setRefeicao(meals.map((meal) => (meal.refid === refeicaoAtual.refid ? refeicaoAtual : meal)))
      setDialogState({ ...dialogState, isEditOpen: false })
      setRefeicaoAtual(null)

      toast.success("Refeição atualizada com sucesso!")
    } catch (error) {
      console.error("Erro ao atualizar refeição:", error)
    }
  }

  // Função para lidar com dados detectados pela IA
  const handleMealDetected = (mealData: Partial<IRefeicao>) => {
    setRefeicaoNova((prev) => ({
      ...prev,
      ...mealData,
      useremail: email,
      refid: prev.refid,
    }))
    setDialogState({ ...dialogState, isAddOpen: true })
  }

  function callDelete(id: string): void {
    handleDeletarRefeicao(id, meals, setRefeicao, deleteMeal)
  }

  const handleAddMealWithType = (type?: RefeicaoTipo) => {
    if (type) {
      setRefeicaoNova((prev) => ({ ...prev, tipo: type }))
    }
    setDialogState({ ...dialogState, isAddOpen: true })
  }

  return (
    <div className="w-full max-w-[1920px] mx-auto px-2 xs:px-3 sm:px-4 md:px-5 lg:px-6 xl:px-8 2xl:px-10 py-3 xs:py-4 sm:py-5 md:py-6 no-scrollbar-x">
      <div className="flex flex-col gap-3 xs:gap-4 sm:gap-5 md:gap-6">
        {/* Header Section */}
        <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2 xs:gap-3 sm:gap-4">
          <div className="space-y-1 min-w-0 flex-1">
            <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold tracking-tight truncate">Bem vindo, {name}! 👋</h1>
            <p className="text-xs xs:text-sm sm:text-base text-muted-foreground">
              Gerencie suas refeições e acompanhe suas calorias diárias.
            </p>
          </div>
        </div>

        {/* Quick Stats Cards - Otimizado para mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 xs:gap-3 sm:gap-4">
          <Card className="min-w-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 xs:pb-2 px-3 xs:px-4 pt-3 xs:pt-4">
              <CardTitle className="text-xs xs:text-sm font-medium truncate">Hoje</CardTitle>
              <Calendar className="h-3 w-3 xs:h-4 xs:w-4 text-muted-foreground flex-shrink-0" />
            </CardHeader>
            <CardContent className="px-3 xs:px-4 pb-3 xs:pb-4">
              <div className="text-lg xs:text-xl sm:text-2xl font-bold">{todayCalories}</div>
              <p className="text-xs text-muted-foreground truncate">{todayMeals.length} refeições</p>
            </CardContent>
          </Card>

          <Card className="min-w-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 xs:pb-2 px-3 xs:px-4 pt-3 xs:pt-4">
              <CardTitle className="text-xs xs:text-sm font-medium truncate">Média Semanal</CardTitle>
              <TrendingUp className="h-3 w-3 xs:h-4 xs:w-4 text-muted-foreground flex-shrink-0" />
            </CardHeader>
            <CardContent className="px-3 xs:px-4 pb-3 xs:pb-4">
              <div className="text-lg xs:text-xl sm:text-2xl font-bold">{avgDailyCalories}</div>
              <p className="text-xs text-muted-foreground">kcal/dia</p>
            </CardContent>
          </Card>

          <Card className="min-w-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 xs:pb-2 px-3 xs:px-4 pt-3 xs:pt-4">
              <CardTitle className="text-xs xs:text-sm font-medium truncate">Meta Diária</CardTitle>
              <Target className="h-3 w-3 xs:h-4 xs:w-4 text-muted-foreground flex-shrink-0" />
            </CardHeader>
            <CardContent className="px-3 xs:px-4 pb-3 xs:pb-4">
              <div className="text-lg xs:text-xl sm:text-2xl font-bold">2000</div>
              <p className="text-xs text-muted-foreground">{Math.round((todayCalories / 2000) * 100)}% atingido</p>
            </CardContent>
          </Card>

          <Card className="min-w-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 xs:pb-2 px-3 xs:px-4 pt-3 xs:pt-4">
              <CardTitle className="text-xs xs:text-sm font-medium truncate">Plano</CardTitle>
              <Award className="h-3 w-3 xs:h-4 xs:w-4 text-muted-foreground flex-shrink-0" />
            </CardHeader>
            <CardContent className="px-3 xs:px-4 pb-3 xs:pb-4">
              <div className="text-sm xs:text-base sm:text-lg font-bold truncate">{plano}</div>
              <Badge variant={plano === "Basico" ? "secondary" : "default"} className="text-xs mt-1">
                {plano === "Basico" ? "Gratuito" : "Premium"}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Intelligent Meal Form - Compacto para mobile   | plano ? plano : "avançado" */}
        <div className="w-full">
          <IntelligentMealForm onMealDetected={handleMealDetected} userPlan={"Avançado"} /> 
        </div>

        {/* Meals Tabs Section */}
        <div className="w-full">
          <MealTabs
            meals={meals}
            onEdit={(meal) => {
              setRefeicaoAtual(meal)
              setDialogState({ ...dialogState, isEditOpen: true })
            }}
            onDelete={callDelete}
            onAddMeal={handleAddMealWithType}
          />
        </div>

        {/* Analytics Sections - Otimizado para mobile */}
        <div className="space-y-3 xs:space-y-4">
          {/* Análise Nutricional Detalhada - Expandable */}
          <Card>
            <CardHeader className="px-3 xs:px-4 sm:px-6 py-3 xs:py-4">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <CardTitle className="flex items-center gap-2 text-sm xs:text-base">
                    <TrendingUp className="h-4 w-4 xs:h-5 xs:w-5 text-emerald-600 flex-shrink-0" />
                    <span className="truncate">Análise Nutricional</span>
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm mt-1 hidden xs:block">
                    Visualize padrões e tendências da sua alimentação
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSection("analytics")}
                  className="flex items-center gap-1 sm:gap-2 flex-shrink-0 h-8 px-2"
                >
                  {expandedSections.analytics ? (
                    <>
                      <ChevronUp className="h-4 w-4" />
                      <span className="hidden sm:inline text-xs">Recolher</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      <span className="hidden sm:inline text-xs">Expandir</span>
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            {expandedSections.analytics && (
              <CardContent className="px-2 xs:px-3 sm:px-6 pb-3 xs:pb-4 sm:pb-6">
                <div className="overflow-x-auto">
                  <div className="min-w-[300px] xs:min-w-[350px] sm:min-w-[400px]">
                    <NutritionAnalytics meals={meals} />
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Progresso Semanal - Expandable */}
          <Card>
            <CardHeader className="px-3 xs:px-4 sm:px-6 py-3 xs:py-4">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <CardTitle className="flex items-center gap-2 text-sm xs:text-base">
                    <Calendar className="h-4 w-4 xs:h-5 xs:w-5 text-blue-600 flex-shrink-0" />
                    <span className="truncate">Progresso Semanal</span>
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm mt-1 hidden xs:block">
                    Acompanhe sua evolução ao longo da semana
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSection("progress")}
                  className="flex items-center gap-1 sm:gap-2 flex-shrink-0 h-8 px-2"
                >
                  {expandedSections.progress ? (
                    <>
                      <ChevronUp className="h-4 w-4" />
                      <span className="hidden sm:inline text-xs">Recolher</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      <span className="hidden sm:inline text-xs">Expandir</span>
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            {expandedSections.progress && (
              <CardContent className="px-2 xs:px-3 sm:px-6 pb-3 xs:pb-4 sm:pb-6">
                <div className="overflow-x-auto">
                  <div className="min-w-[300px] xs:min-w-[350px] sm:min-w-[400px]">
                    <WeeklyProgress meals={meals} />
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Tendências Mensais - Expandable */}
          <Card>
            <CardHeader className="px-3 xs:px-4 sm:px-6 py-3 xs:py-4">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <CardTitle className="flex items-center gap-2 text-sm xs:text-base">
                    <TrendingUp className="h-4 w-4 xs:h-5 xs:w-5 text-purple-600 flex-shrink-0" />
                    <span className="truncate">Tendências Mensais</span>
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm mt-1 hidden xs:block">
                    Análise de longo prazo dos seus hábitos alimentares
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSection("trends")}
                  className="flex items-center gap-1 sm:gap-2 flex-shrink-0 h-8 px-2"
                >
                  {expandedSections.trends ? (
                    <>
                      <ChevronUp className="h-4 w-4" />
                      <span className="hidden sm:inline text-xs">Recolher</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      <span className="hidden sm:inline text-xs">Expandir</span>
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            {expandedSections.trends && (
              <CardContent className="px-2 xs:px-3 sm:px-6 pb-3 xs:pb-4 sm:pb-6">
                <div className="overflow-x-auto">
                  <div className="min-w-[300px] xs:min-w-[350px] sm:min-w-[400px]">
                    <MonthlyTrends meals={meals} />
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Acompanhamento de Metas - Expandable */}
          <Card>
            <CardHeader className="px-3 xs:px-4 sm:px-6 py-3 xs:py-4">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <CardTitle className="flex items-center gap-2 text-sm xs:text-base">
                    <Target className="h-4 w-4 xs:h-5 xs:w-5 text-orange-600 flex-shrink-0" />
                    <span className="truncate">Acompanhamento de Metas</span>
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm mt-1 hidden xs:block">
                    Monitore o progresso das suas metas nutricionais
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSection("goals")}
                  className="flex items-center gap-1 sm:gap-2 flex-shrink-0 h-8 px-2"
                >
                  {expandedSections.goals ? (
                    <>
                      <ChevronUp className="h-4 w-4" />
                      <span className="hidden sm:inline text-xs">Recolher</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      <span className="hidden sm:inline text-xs">Expandir</span>
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            {expandedSections.goals && (
              <CardContent className="px-2 xs:px-3 sm:px-6 pb-3 xs:pb-4 sm:pb-6">
                <div className="overflow-x-auto">
                  <div className="min-w-[300px] xs:min-w-[350px] sm:min-w-[400px]">
                    <GoalsTracking meals={meals} userPlan={plano ? plano : "Basico"} />
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Sistema de Ingredientes - Expandable */}
          <Card>
            <CardHeader className="px-3 xs:px-4 sm:px-6 py-3 xs:py-4">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <CardTitle className="flex items-center gap-2 text-sm xs:text-base">
                    <Sparkles className="h-4 w-4 xs:h-5 xs:w-5 text-purple-600 flex-shrink-0" />
                    <span className="truncate">Detector de Ingredientes</span>
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm mt-1 hidden xs:block">
                    Detecte ingredientes automaticamente usando IA
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSection("ingredients")}
                  className="flex items-center gap-1 sm:gap-2 flex-shrink-0 h-8 px-2"
                >
                  {expandedSections.ingredients ? (
                    <>
                      <ChevronUp className="h-4 w-4" />
                      <span className="hidden sm:inline text-xs">Recolher</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      <span className="hidden sm:inline text-xs">Expandir</span>
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            {expandedSections.ingredients && (
              <CardContent className="px-2 xs:px-3 sm:px-6 pb-3 xs:pb-4 sm:pb-6">
                <IngredientDetector />
              </CardContent>
            )}
          </Card>

          {/* Sistema de Depósitos - Expandable */}
          <Card>
            <CardHeader className="px-3 xs:px-4 sm:px-6 py-3 xs:py-4">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <CardTitle className="flex items-center gap-2 text-sm xs:text-base">
                    <ChefHat className="h-4 w-4 xs:h-5 xs:w-5 text-orange-600 flex-shrink-0" />
                    <span className="truncate">Depósitos de Ingredientes</span>
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm mt-1 hidden xs:block">
                    Organize ingredientes e receba sugestões personalizadas da IA
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSection("deposits")}
                  className="flex items-center gap-1 sm:gap-2 flex-shrink-0 h-8 px-2"
                >
                  {expandedSections.deposits ? (
                    <>
                      <ChevronUp className="h-4 w-4" />
                      <span className="hidden sm:inline text-xs">Recolher</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      <span className="hidden sm:inline text-xs">Expandir</span>
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            {expandedSections.deposits && (
              <CardContent className="px-2 xs:px-3 sm:px-6 pb-3 xs:pb-4 sm:pb-6">
                <DepositosManager userEmail={email} />
              </CardContent>
            )}
          </Card>
        </div>

        {/* Dialogs */}
        <AddMealDialog
          isOpen={dialogState.isAddOpen}
          onOpenChange={(open) => setDialogState({ ...dialogState, isAddOpen: open })}
          onAddMeal={handleAddMeal}
          refeicaoNova={refeicaoNova}
          updateRefeicaoNova={updateRefeicaoNova}
          updateRefeicaoNovaDesc={updateRefeicaoNovaDesc}
          updateRefeicaoNovaExtra={updateRefeicaoNovaExtra}
          removeRefeicaoNovaExtra={removeRefeicaoNovaExtra}
          addNewExtraField={addNewExtraField}
        />

        <EditMealDialog
          isOpen={dialogState.isEditOpen}
          onOpenChange={(open) => setDialogState({ ...dialogState, isEditOpen: open })}
          onEditMeal={handleEditMeal}
          refeicaoAtual={refeicaoAtual}
          updateRefeicaoAtual={updateRefeicaoAtual}
          updateRefeicaoAtualDesc={updateRefeicaoAtualDesc}
          removeRefeicaoAtualExtra={removeRefeicaoAtualExtra}
          updateRefeicaoAtualExtra={updateRefeicaoAtualExtra}
          addCurrentExtraField={addCurrentExtraField}
        />
      </div>
    </div>
  )
}
