"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import type { CameraState } from "@/types/intelligent-meal"

export function useCamera() {
  const [cameraState, setCameraState] = useState<CameraState>({
    isOpen: false,
    stream: null,
    facingMode: "environment",
    hasPermission: false,
    error: null,
  })

  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const initCamera = useCallback(async () => {
    try {
      // Parar stream anterior se existir
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }

      // Verificar se o navegador suporta getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Câmera não suportada neste navegador")
      }

      const constraints = {
        video: {
          facingMode: cameraState.facingMode,
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
        },
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream

      setCameraState((prev) => ({
        ...prev,
        stream,
        hasPermission: true,
        isOpen: true,
        error: null,
      }))

      // Aguardar um pouco antes de definir o srcObject
      if (videoRef.current) {
        videoRef.current.srcObject = stream

        // Aguardar o vídeo carregar
        return new Promise<boolean>((resolve) => {
          const video = videoRef.current!
          video.onloadedmetadata = () => {
            video
              .play()
              .then(() => resolve(true))
              .catch(() => resolve(false))
          }
        })
      }

      return true
    } catch (error) {
      let errorMessage = "Não foi possível acessar a câmera."

      if (error instanceof Error) {
        if (error.name === "NotAllowedError") {
          errorMessage = "Permissão de câmera negada. Permita o acesso e tente novamente."
        } else if (error.name === "NotFoundError") {
          errorMessage = "Nenhuma câmera encontrada no dispositivo."
        } else if (error.name === "NotReadableError") {
          errorMessage = "Câmera está sendo usada por outro aplicativo."
        }
      }

      setCameraState((prev) => ({
        ...prev,
        error: errorMessage,
        hasPermission: false,
        isOpen: false,
      }))

      console.error("Camera error:", error)
      return false
    }
  }, [cameraState.facingMode])

  const switchCamera = useCallback(async () => {
    const newFacingMode = cameraState.facingMode === "user" ? "environment" : "user"
    setCameraState((prev) => ({ ...prev, facingMode: newFacingMode }))
    await initCamera()
  }, [cameraState.facingMode, initCamera])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    setCameraState((prev) => ({
      ...prev,
      isOpen: false,
      stream: null,
    }))
  }, [])

  // Limpeza quando o componente desmontar
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [stopCamera])

  return {
    cameraState,
    videoRef,
    initCamera,
    switchCamera,
    stopCamera,
  }
}
