"use client"
import type { IRefeicao } from "@/model/refeicao"
import { toast } from "sonner"
import { getMeals } from "@/services/v1"

export const handleDeletarRefeicao = async (
  id: string,
  meals: IRefeicao[],
  setRefeicao: (meals: IRefeicao[]) => void,
  deleteMeal: (meal: IRefeicao) => Promise<void>,
) => {
  toast("Tem certeza que deseja remover esta refeição?", {
    action: {
      label: "Confirmar",
      onClick: async () => {
        try {
          const mealtoDelete = meals.find((meal) => meal.refid === id)
          if (mealtoDelete) {
            await deleteMeal(mealtoDelete)
          }

          setRefeicao(meals.filter((meal) => meal.refid !== id))
          await getMeals()
          toast.success("Refeição removida com sucesso!")
        } catch (error) {
          console.error("Erro ao deletar refeição:", error)
          toast.error("Ocorreu um erro ao remover a refeição.")
        }
      },
    },
    cancel: {
      label: "Cancelar",
      onClick: () => {},
    },
  })
}
