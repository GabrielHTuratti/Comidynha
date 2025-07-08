"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Camera, ImageIcon, Sparkles, X } from "lucide-react"
import { toast } from "sonner"
import { CameraCapture } from "./camera-capture"
import { PhotoPreview } from "./photo-preview"
import { AnalysisLoading } from "./analysis-loading"
import { MealConfirmation } from "./meal-confirmation"
import { analyzeMealImage } from "@/services/gemini-vision"
import type { IRefeicao } from "@/model/refeicao"

type ProcessStage = "selection" | "camera" | "preview" | "analysis" | "confirmation"

interface AnalysisState {
  isAnalyzing: boolean
  result: IRefeicao | null
  error: string | null
}

interface IntelligentMealFormProps {
  onMealDetected: (mealData: IRefeicao) => void
  userPlan: string
}

export function IntelligentMealForm({ onMealDetected, userPlan }: IntelligentMealFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [stage, setStage] = useState<ProcessStage>("selection")
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    isAnalyzing: false,
    result: null,
    error: null,
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  const isAdvancedPlan = userPlan === "Avançado" || userPlan === "Premium"

  const handleOpenModal = () => {
    if (!isAdvancedPlan) {
      toast.error("Recurso exclusivo para planos Avançado e Premium", {
        description: "Faça upgrade para usar o reconhecimento por IA",
      })
      return
    }
    setIsOpen(true)
    setStage("selection")
  }

  const handleCloseModal = () => {
    setIsOpen(false)
    setStage("selection")
    setCapturedImage(null)
    setAnalysisState({
      isAnalyzing: false,
      result: null,
      error: null,
    })
  }

  const handleCameraCapture = (imageData: string) => {
    console.log("Imagem recebida da câmera:", imageData.substring(0, 50) + "...")
    setCapturedImage(imageData)
    setStage("preview")
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = e.target?.result as string
        console.log("Imagem selecionada da galeria:", imageData.substring(0, 50) + "...")
        setCapturedImage(imageData)
        setStage("preview")
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRetakePhoto = () => {
    setCapturedImage(null)
    setStage("camera")
  }

  const handleConfirmPhoto = async () => {
    if (!capturedImage) {
      toast.error("Nenhuma imagem disponível")
      return
    }

    setStage("analysis")
    setAnalysisState({ isAnalyzing: true, result: null, error: null })

    try {
      // Extrair base64 se necessário
      const base64Data = capturedImage.includes(",") ? capturedImage.split(",")[1] : capturedImage

      console.log("Enviando para análise:", base64Data.substring(0, 50) + "...")

      const mealData = await analyzeMealImage(base64Data)

      setAnalysisState({
        isAnalyzing: false,
        result: mealData,
        error: null,
      })
      setStage("confirmation")
    } catch (error) {
      console.error("Erro na análise:", error)
      setAnalysisState({
        isAnalyzing: false,
        result: null,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      })
      toast.error("Falha na análise da imagem", {
        description: "Tente novamente ou cadastre manualmente",
      })
      setStage("preview")
    }
  }

  const handleConfirmMeal = (mealData: IRefeicao) => {
    onMealDetected(mealData)
    handleCloseModal()
    toast.success("Refeição detectada com sucesso!", {
      description: "Os dados foram pré-preenchidos no formulário",
    })
  }

  const renderModalContent = () => {
    switch (stage) {
      case "selection":
        return (
          <div className="p-6 space-y-4">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="h-6 w-6 text-emerald-500" />
                <Badge className="bg-emerald-100 text-emerald-700">IA EXCLUSIVA</Badge>
              </div>
              <h2 className="text-xl font-semibold">Reconhecimento Inteligente</h2>
              <p className="text-sm text-muted-foreground">
                Detecte automaticamente ingredientes e valores nutricionais
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => setStage("camera")}
                className="w-full h-14 text-left justify-start"
                variant="outline"
              >
                <Camera className="h-5 w-5 mr-3" />
                <div>
                  <div className="font-medium">Tirar Foto</div>
                  <div className="text-xs text-muted-foreground">Use a câmera do dispositivo</div>
                </div>
              </Button>

              <Button
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-14 text-left justify-start"
                variant="outline"
              >
                <ImageIcon className="h-5 w-5 mr-3" />
                <div>
                  <div className="font-medium">Escolher da Galeria</div>
                  <div className="text-xs text-muted-foreground">Selecione uma foto existente</div>
                </div>
              </Button>
            </div>

            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
          </div>
        )

      case "camera":
        return <CameraCapture onCapture={handleCameraCapture} onCancel={() => setStage("selection")} />

      case "preview":
        return capturedImage ? (
          <PhotoPreview imageData={capturedImage} onConfirm={handleConfirmPhoto} onRetake={handleRetakePhoto} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Erro: Imagem não disponível</p>
          </div>
        )

      case "analysis":
        return <AnalysisLoading />

      case "confirmation":
        return analysisState.result ? (
          <MealConfirmation meal={analysisState.result} onConfirm={handleConfirmMeal} onCancel={handleCloseModal} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Erro: Resultado da análise não disponível</p>
          </div>
        )

      default:
        return (
          <div className="flex items-center justify-center h-full">
            <p>Estado desconhecido</p>
          </div>
        )
    }
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={handleOpenModal}
          size="lg"
          className={`rounded-full w-14 h-14 shadow-lg ${
            isAdvancedPlan ? "bg-emerald-600 hover:bg-emerald-700" : "bg-gray-400 hover:bg-gray-500"
          }`}
        >
          <Sparkles className="h-6 w-6" />
        </Button>

        {isAdvancedPlan && (
          <Badge className="absolute -top-2 -left-2 bg-emerald-100 text-emerald-700 text-xs">IA</Badge>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className={`max-w-4xl h-[90vh] p-0 ${stage === "camera" ? "bg-black" : "bg-white"}`}>
          {stage !== "camera" && (
            <Button onClick={handleCloseModal} variant="ghost" size="icon" className="absolute top-4 right-4 z-10">
              <X className="h-4 w-4" />
            </Button>
          )}

          {renderModalContent()}
        </DialogContent>
      </Dialog>
    </>
  )
}
