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
      proteinas: "0",
      carboidratos: "0",
      gorduras: "0",
      extra: [{campoid: "",
        nome: "",
        valor: "",}],
    },
    calorias: 0,
    data: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16),
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
    setRefeicaoNova({...refeicaoNova, ...updates })
  }

  const updateRefeicaoNovaDesc = (newDesc: Partial<typeof refeicaoNova.desc>) => {
    setRefeicaoNova(prev => ({
      ...prev,
      desc: {
        ...prev.desc,
        ...newDesc
      }
    }));
  };

  const updateRefeicaoNovaExtra = (campoid: string, novoNome: string, novoValor: string) => {
    const novosExtras = (refeicaoNova.desc.extra || []).map(campo => 
      campo.campoid === campoid ? { ...campo, nome: novoNome, valor: novoValor } : campo
    );
  
    setRefeicaoNova({
      ...refeicaoNova,
      desc: {
        ...refeicaoNova.desc,
        extra: novosExtras,
      },
    });
  };

  
  const addNewExtraField = () => {
    const novoCampo = { campoid: Date.now().toString(), nome: "", valor: "" };
    
    setRefeicaoNova({
      ...refeicaoNova,
      desc: {
        ...refeicaoNova.desc,
        extra: [...(refeicaoNova.desc.extra || []), novoCampo],
      },
    });
  };

  const updateRefeicaoAtualExtra= (campoid: string, novoNome: string, novoValor: string) => {
    if (!refeicaoAtual) return;
  
    const novosExtras = (refeicaoAtual.desc.extra || []).map(campo =>
      campo.campoid === campoid ? { ...campo, nome: novoNome, valor: novoValor } : campo
    );
  
    setRefeicaoAtual({
      ...refeicaoAtual,
      desc: {
        ...refeicaoAtual.desc,
        extra: novosExtras,
      },
    });
  };

  const removeRefeicaoNovaExtra = (campoid: string) => {
    const novosExtras = (refeicaoNova.desc.extra || []).filter(campo => campo.campoid !== campoid);
    setRefeicaoNova({
      ...refeicaoNova,
      desc: {
        ...refeicaoNova.desc,
        extra: novosExtras,
      },
    });
  };

  const removeRefeicaoAtualExtra = (campoid: string) => {
    if (!refeicaoAtual) return;
  
    const novosExtras = (refeicaoAtual.desc.extra || []).filter(campo => campo.campoid !== campoid);
  
    setRefeicaoAtual({
      ...refeicaoAtual,
      desc: {
        ...refeicaoAtual.desc,
        extra: novosExtras,
      },
    });
  };


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
    if (!refeicaoAtual) return;
  
    const novoCampo = { campoid: Date.now().toString(), nome: "", valor: "" };
    
    setRefeicaoAtual({
      ...refeicaoAtual,
      desc: {
        ...refeicaoAtual.desc,
        extra: [...(refeicaoAtual.desc.extra || []), novoCampo],
      },
    });
  };

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
        proteinas: "0",
        carboidratos: "0",
        gorduras: "0",
        extra: [{campoid: "",
          nome: "",
          valor: "",}],
      },
      calorias: 0,
      data: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16),
      tipo: "cafe-da-manha",
    })

    toast({
      title: "Refeição adicionada",
      description: "Sua refeição foi adicionada com sucesso.",
    })

    try {
      await createMeal(mealToAdd)
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
      await updateMeal(refeicaoAtual)
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
    handleDeletarRefeicao(id, meals, setRefeicao, deleteMeal)
  }

  const handleAddMealWithType = (type?: RefeicaoTipo) => {
    if (type) {
      setRefeicaoNova((prev) => ({ ...prev, tipo: type }))
    }
    setDialogState({ ...dialogState, isAddOpen: true })
  }

  return (
    <div className="w-full max-w-[1920px] mx-auto px-3 sm:px-4 md:px-5 lg:px-6 xl:px-8 2xl:px-10 py-4 sm:py-5 md:py-6">
      <div className="flex flex-col gap-4 sm:gap-5 md:gap-6">
      <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-3 sm:gap-4">          <div>
        <div className="space-y-1">
            <h1 className="text-2xl xs:text-2xl sm:text-3xl font-bold tracking-tight">
              Bem vindo! {name}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Gerencie suas refeições e acompanhe suas calorias diárias.
            </p>
        </div>
        
          <div className="flex flex-col xs:flex-row gap-2 w-full xs:w-auto">
            <PDFExportButton meals={meals} userName={name} />
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700 whitespace-nowrap"
              onClick={() => handleAddMealWithType()}
            >
              <Plus className="mr-2 h-4 w-4" />
              <span className="text-xs sm:text-sm">Adicionar Refeição</span>
            </Button>
          </div>
        </div>

        <div className="w-full">
          <MealStats meals={meals} />
        </div>

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
        onOpenChange={(open) => setDialogState({ ...dialogState, isEditOpen: open })}
        onEditMeal={handleEditMeal}
        refeicaoAtual={refeicaoAtual}
        updateRefeicaoAtual={updateRefeicaoAtual}
        updateRefeicaoAtualDesc={updateRefeicaoAtualDesc}
        removeRefeicaoAtualExtra={removeRefeicaoAtualExtra}
        updateRefeicaoAtualExtra={updateRefeicaoAtualExtra}
        addCurrentExtraField={addCurrentExtraField}
      />

      <Toaster />
      </div>
    </div>  
  )
}