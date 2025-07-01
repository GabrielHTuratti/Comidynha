"use client"

import { Button } from "@/components/ui/button"
import { Camera, RotateCcw, X } from "lucide-react"
import { useCamera } from "@/hooks/use-camera"
import { useEffect } from "react"

interface CameraCaptureProps {
  onCapture: (imageData: string) => void
  onCancel: () => void
}

export function CameraCapture({ onCapture, onCancel }: CameraCaptureProps) {
  const { cameraState, videoRef, canvasRef, requestCameraPermission, switchCamera, capturePhoto, stopCamera } =
    useCamera()

  useEffect(() => {
    requestCameraPermission()
    return () => stopCamera()
  }, [requestCameraPermission, stopCamera])

  const handleCapture = () => {
    const imageData = capturePhoto()
    if (imageData) {
      onCapture(imageData)
    }
  }

  const handleCancel = () => {
    stopCamera()
    onCancel()
  }

  if (cameraState.error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="text-red-500 mb-4">
          <Camera className="h-12 w-12 mx-auto mb-2" />
          <p className="text-sm">{cameraState.error}</p>
        </div>
        <Button onClick={handleCancel} variant="outline">
          Voltar
        </Button>
      </div>
    )
  }

  return (
    <div className="relative h-full bg-black">
      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />

      <canvas ref={canvasRef} className="hidden" />

      {/* Overlay com controles */}
      <div className="absolute inset-0 flex flex-col justify-between p-4">
        {/* Header com botão fechar */}
        <div className="flex justify-between items-center">
          <Button
            onClick={handleCancel}
            variant="ghost"
            size="icon"
            className="bg-black/50 text-white hover:bg-black/70"
          >
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

        {/* Guia de enquadramento */}
        <div className="flex-1 flex items-center justify-center">
          <div className="border-2 border-white/50 rounded-lg w-80 h-60 flex items-center justify-center">
            <p className="text-white/70 text-sm text-center px-4">Posicione a refeição dentro desta área</p>
          </div>
        </div>

        {/* Botão de captura */}
        <div className="flex justify-center">
          <Button
            onClick={handleCapture}
            size="lg"
            className="bg-white text-black hover:bg-gray-100 rounded-full w-16 h-16 p-0"
            disabled={!cameraState.hasPermission}
          >
            <Camera className="h-8 w-8" />
          </Button>
        </div>
      </div>
    </div>
  )
}
