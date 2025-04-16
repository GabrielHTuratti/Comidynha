"use client"

import { Button } from "@/components/ui/button"
import { FileDown } from "lucide-react"
import { generateMealsPDF } from "@/lib/pdf-gerador"
import type { IRefeicao } from "@/model/refeicao"

interface PDFExportButtonProps {
  meals: IRefeicao[]
  userName: string
}

export function PDFExportButton({ meals, userName }: PDFExportButtonProps) {
  const handleExportPDF = () => {
    alert(meals + "-" + userName);
    generateMealsPDF(meals, userName)
  }

  return (
    <Button onClick={handleExportPDF} variant="outline" className="flex items-center gap-2">
      <FileDown className="h-4 w-4" />
      Exportar PDF
    </Button>
  )
}
