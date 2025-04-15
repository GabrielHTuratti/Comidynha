"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { MealStats } from "@/components/refeicao/refeicao-stats"
import { MealTabs } from "@/components/refeicao/refeicao-tabs"
import { AddMealDialog } from "@/components/refeicao/add-refeicao-dialog"
import { EditMealDialog } from "@/components/refeicao/edit-refeicao-dialog"
import { PDFExportButton } from "@/components/refeicao/pdf-export-button"
import { createMeal, getMeals, deleteMeal, updateMeal, getProfile } from "@/services/v1"
import bcrypt from "bcryptjs"
import type { IRefeicao, nutridesc, RefeicaoTipo } from "@/model/refeicao"
import type { IUser } from "@/model/users"
import { handleDeletarRefeicao } from "@/components/cliente/handleDeletarRefeicao"

export default function Main() {
  const [meals, setRefeicao] = useState<IRefeicao[]>([])
  const [email, setEmail] = useState<IUser["email"] | string>("")
  const [name, setName] = useState<IUser["name"] | string>("")

  const [dialogState, setDialogState] = useState({
    isAddOpen: false,
    isEditOpen: false,
  })
  const [refeicaoAtual, setRefeicaoAtual] = useState<IRefeicao | null>(null)

  const [refeicaoNova, setRefeicaoNova] = useState<Omit<IRefeicao, "_id">>({
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

  useEffect(() => {
    const getUser = async () => {
      const profile = await getProfile()
      const email = await profile.email
      const nome = await profile.name
      setName(nome)
      setEmail(email)
      setRefeicaoNova((prev) => ({ ...prev, useremail: email }))
    }
    getUser()

    const getMeal = async () => {
      const meals = await getMeals()
      setRefeicao(meals)
    }
    getMeal()
  }, [])

  const updateRefeicaoNova = (updates: Omit<IRefeicao, "_id">) => {
    setRefeicaoNova((prev) => ({ ...prev, ...updates }))
  }

  const updateRefeicaoNovaDesc = (updates: nutridesc) => {
    setRefeicaoNova((prev) => ({
      ...prev,
      desc: { ...prev.desc, ...updates },
    }))
  }

  const updateRefeicaoNovaExtra = (key: string, value: string) => {
    setRefeicaoNova((prev) => ({
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
    if (!refeicaoAtual) return
    setRefeicaoAtual((prev) => {
      if (!prev) return null
      return { ...prev, desc: { ...prev.desc, extra: { ...prev.desc.extra, [key]: value } } }
    })
  }

  const removeRefeicaoNovaExtra = (key: string) => {
    setRefeicaoNova((prev) => {
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
    setRefeicaoNova((prev) => ({
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

  const removeRefeicaoAtualExtra = (key: string) => {
    if (!refeicaoAtual) return
    setRefeicaoAtual((prev) => {
      if (!prev) return null
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

  const addCurrentExtraField = () => {
    if (!refeicaoAtual) return

    setRefeicaoAtual((prev) => {
      if (!prev) return null

      return {
        ...prev,
        desc: {
          ...prev.desc,
          extra: {
            ...prev.desc.extra,
            [`campo-${Date.now()}`]: "",
          },
        },
      }
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

    setRefeicaoNova({
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
    if (!refeicaoAtual) {
      toast({
        title: "Erro",
        description: "Nenhuma refeição selecionada para edição",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await updateMeal(refeicaoAtual)
      setRefeicao(meals.map((meal) => (meal.refid === refeicaoAtual.refid ? refeicaoAtual : meal)))
      setDialogState({ ...dialogState, isEditOpen: false })
      setRefeicaoAtual(null)

      toast({
        title: "Refeição atualizada",
        description: "Sua refeição foi atualizada com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao atualizar refeição:", error)
    }
  }

  function callDelete(id: string): void {
    handleDeletarRefeicao(id, meals, setRefeicao, deleteMeal, toast)
  }

  const handleAddMealWithType = (type?: RefeicaoTipo) => {
    if (type) {
      setRefeicaoNova((prev) => ({ ...prev, tipo: type }))
    }
    setDialogState({ ...dialogState, isAddOpen: true })
  }

  return (
    <div className="container py-6 px-4 md:px-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Bem vindo! {name}</h1>
            <p className="text-muted-foreground">Gerencie suas refeições e acompanhe suas calorias diárias.</p>
          </div>
          <div className="flex gap-2">
            <PDFExportButton meals={meals} userName={name} />
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => handleAddMealWithType()}>
              <Plus className="mr-2 h-4 w-4" /> Adicionar Refeição
            </Button>
          </div>
        </div>

        <MealStats meals={meals} />

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
        onOpenChange={(open: any) => setDialogState({ ...dialogState, isEditOpen: open })}
        onEditMeal={handleEditMeal}
        refeicaoAtual={refeicaoAtual}
        updateRefeicaoAtual={updateRefeicaoAtual}
        updateRefeicaoAtualDesc={updateRefeicaoAtualDesc}
        updateRefeicaoAtualExtra={updateRefeicaoAtualExtra}
        removeRefeicaoAtualExtra={removeRefeicaoAtualExtra}
        addCurrentExtraField={addCurrentExtraField}
      />

      <Toaster />
    </div>
  )
}