"use client"

import { Loader2, Sparkles } from "lucide-react"

export function AnalysisLoading() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="relative mb-6">
        <Sparkles className="h-16 w-16 text-emerald-500 animate-pulse" />
        <Loader2 className="h-8 w-8 text-emerald-600 animate-spin absolute top-4 left-4" />
      </div>

      <h3 className="text-lg font-semibold mb-2">Analisando sua refeição...</h3>
      <p className="text-muted-foreground text-sm mb-4">
        Nossa IA está identificando os ingredientes e calculando os valores nutricionais
      </p>

      <div className="w-full max-w-xs">
        <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
          <div className="bg-emerald-500 h-2 rounded-full animate-pulse" style={{ width: "70%" }} />
        </div>
        <p className="text-xs text-muted-foreground mt-2">Processando...</p>
      </div>
    </div>
  )
}
