'use client'
import { IRefeicao } from "@/model/refeicao"
import { confirmToast } from "./confirmarButton"
import { toast } from "../ui/use-toast"
import { getMeals } from "@/services/v1"

export const handleDeletarRefeicao = async (
    id: string,
    meals: IRefeicao[],
    setRefeicao: (meals: IRefeicao[]) => void,
    deleteMeal: (meal: IRefeicao) => Promise<void>
  ) => {
    confirmToast( 
      toast,
      "Tem certeza que deseja remover esta refeição?",
      async () => {
        try {
  
          const mealtoDelete = meals.find((meal) => meal.refid === id)
          if(mealtoDelete){
            await deleteMeal(mealtoDelete);
          }
  
          setRefeicao(meals.filter((meal) => meal.refid !== id))

          await getMeals()

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