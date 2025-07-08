"use client"

import { useEffect } from "react"
import { Camera, RotateCcw, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCamera } from "@/hooks/use-camera"
import { toast } from "sonner"

interface CameraCaptureProps {
  onCapture: (imageData: string) => void
  onCancel: () => void
}

export function CameraCapture({ onCapture, onCancel }: CameraCaptureProps) {
  const { cameraState, videoRef, initCamera, switchCamera, stopCamera } = useCamera()

  useEffect(() => {
    initCamera()

    return () => {
      stopCamera()
    }
  }, [initCamera, stopCamera])

  const handleCapture = () => {
    if (!videoRef.current) {
      toast.error("Vídeo não disponível")
      return
    }

    const video = videoRef.current

    // Verificar se o vídeo está carregado
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      toast.error("Câmera não está pronta. Aguarde um momento.")
      return
    }

    try {
      const canvas = document.createElement("canvas")
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      const ctx = canvas.getContext("2d")
      if (!ctx) {
        toast.error("Erro ao processar imagem")
        return
      }

      // Desenhar o frame atual do vídeo no canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Converter para base64
      const imageData = canvas.toDataURL("image/jpeg", 0.9)

      console.log("Imagem capturada:", imageData.substring(0, 50) + "...")

      // Chamar callback com a imagem
      onCapture(imageData)
    } catch (error) {
      console.error("Erro na captura:", error)
      toast.error("Erro ao capturar imagem")
    }
  }

  if (!cameraState.isOpen && !cameraState.error) {
    return (
      <div className="flex items-center justify-center h-full bg-black">
        <div className="text-white animate-pulse">Iniciando câmera...</div>
      </div>
    )
  }

  if (cameraState.error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-black">
        <div className="text-red-500 mb-4">
          <Camera className="h-12 w-12 mx-auto mb-2" />
          <p className="text-sm">{cameraState.error}</p>
        </div>
        <Button onClick={onCancel} variant="outline">
          Voltar
        </Button>
      </div>
    )
  }

  return (
    <div className="relative h-full bg-black">
      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />

      {/* Overlay com controles */}
      <div className="absolute inset-0 flex flex-col justify-between p-4">
        {/* Header com botões */}
        <div className="flex justify-between items-center">
          <Button onClick={onCancel} variant="ghost" size="icon" className="bg-black/50 text-white hover:bg-black/70">
            <X className="h-5 w-5" />
          </Button>

          <Button
            onClick={switchCamera}
            variant="ghost"
            size="icon"
            className="bg-black/50 text-white hover:bg-black/70"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>

        {/* Botão de captura */}
        <div className="flex justify-center pb-8">
          <Button
            onClick={handleCapture}
            size="lg"
            className="bg-white text-black hover:bg-gray-100 rounded-full w-16 h-16 p-0 shadow-lg"
            disabled={!cameraState.hasPermission || !cameraState.isOpen}
          >
            <Camera className="h-8 w-8" />
          </Button>
        </div>
      </div>
    </div>
  )
}
