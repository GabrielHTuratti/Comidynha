"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Sparkles } from "lucide-react"
import { ImageUpload } from "./image-upload"
import { DetectionResults } from "./detection-results"
import { IIngredienteItem } from "@/model/ingrediente"
import { DetectionResult } from "@/types/intelligent-meal"

export default function IngredientDetector() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<DetectionResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleImageSelect = (image: string) => {
    setSelectedImage(image)
    setResult(null)
    setError(null)
  }

  const analyzeImage = async () => {
    if (!selectedImage) return

    setIsAnalyzing(true)
    setError(null)

    try {
      // Remover o prefixo data:image/jpeg;base64, se existir
      const base64Data = selectedImage.split(",")[1] || selectedImage

      const response = await fetch("/api/ingredientes/detectar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: base64Data,
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao analisar imagem")
      }

      const data: DetectionResult = await response.json()
      setResult(data)
    } catch (err) {
      setError("Erro ao detectar ingredientes. Tente novamente.")
      console.error("Erro:", err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSaveIngredients = async (ingredientes: IIngredienteItem[]) => {
    const response = await fetch("/api/ingredientes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ingredientes),
    })

    if (!response.ok) {
      throw new Error("Erro ao salvar ingredientes")
    }

    // Reset state after successful save
    setResult(null)
    setSelectedImage(null)
  }

  const handleCancel = () => {
    setResult(null)
    setSelectedImage(null)
    setError(null)
  }

  return (
    <div className="space-y-6">
      {!result ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Detector de Ingredientes IA
            </CardTitle>
            <CardDescription>
              Faça upload de uma foto de ingredientes para detectá-los automaticamente usando inteligência artificial
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUpload
              selectedImage={selectedImage}
              onImageSelect={handleImageSelect}
              onAnalyze={analyzeImage}
              isAnalyzing={isAnalyzing}
            />

            {/* Error Display */}
            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg mt-4">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <span className="text-red-700">{error}</span>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <DetectionResults result={result} onSave={handleSaveIngredients} onCancel={handleCancel} />
      )}
    </div>
  )
}
