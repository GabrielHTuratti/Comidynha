"use client"

import { Button } from "@/components/ui/button"
import { Check, RotateCcw } from "lucide-react"
import Image from "next/image"

interface PhotoPreviewProps {
  imageData: string
  onConfirm: () => void
  onRetake: () => void
}

export function PhotoPreview({ imageData, onConfirm, onRetake }: PhotoPreviewProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Preview da imagem */}
      <div className="flex-1 relative bg-black">
        <Image src={imageData || "/placeholder.svg"} alt="Preview da refeição" fill className="object-contain" />
      </div>

      {/* Controles */}
      <div className="p-4 bg-white border-t">
        <div className="flex gap-3 justify-center">
          <Button onClick={onRetake} variant="outline" className="flex-1 max-w-40 bg-transparent">
            <RotateCcw className="h-4 w-4 mr-2" />
            Tirar Novamente
          </Button>

          <Button onClick={onConfirm} className="flex-1 max-w-40 bg-emerald-600 hover:bg-emerald-700">
            <Check className="h-4 w-4 mr-2" />
            Confirmar
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-2">
          Certifique-se de que a refeição está bem visível na foto
        </p>
      </div>
    </div>
  )
}
