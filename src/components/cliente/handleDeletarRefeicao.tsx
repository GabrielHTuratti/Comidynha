'use client'
import { confirmToast } from "./confirmarButton"

export const handleDeletarRefeicao = async (
    id: string,
    meals: any[],
    setRefeicao: (meals: any[]) => void,
    deleteMeal: (meal: any) => Promise<void>,
    toast: any,
  ) => {
    confirmToast(
      toast, 
      "Tem certeza que deseja remover esta refeição?",
      async () => {
        try {
          const updatedMeals = meals.filter((meal) => meal.refid !== id)
          const deletedMeals = meals.filter((meal) => meal.refid === id)
  
          for (const meal of deletedMeals) {
            await deleteMeal(meal)
          }
  
          setRefeicao(updatedMeals)
          toast({
            title: "Refeição removida",
            description: "Sua refeição foi removida com sucesso.",
          })
        } catch (error) {
          console.error("Erro ao deletar refeição:", error)
          toast({
            title: "Erro",
            description: "Ocorreu um erro ao remover a refeição.",
            variant: "destructive",
          })
        }
      }
    )
  }