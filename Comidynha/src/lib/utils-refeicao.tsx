"use client"

import { Coffee, Salad, Cookie, ChefHat, Utensils } from 'lucide-react'
import type { RefeicaoTipo } from "@/model/refeicao"

export function getMealTypeIcon(type: RefeicaoTipo) {
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

export function getMealTypeName(type: RefeicaoTipo) {
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

export function IsoStringToDate(isoString: string) {
  const date = new Date(isoString)

  const offset = date.getTimezoneOffset() * 60000
  const localDate = new Date(date.getTime() - offset)

  return localDate.toISOString().slice(0, 16)
}

export function dateToIsoString(date: string) {
  return new Date(date).toISOString()
}
