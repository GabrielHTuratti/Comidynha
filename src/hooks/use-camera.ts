"use client"

import { useState, useRef, useCallback } from "react"
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
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const requestCameraPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: cameraState.facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })

      setCameraState((prev) => ({
        ...prev,
        stream,
        hasPermission: true,
        isOpen: true,
        error: null,
      }))

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      return true
    } catch (error) {
      setCameraState((prev) => ({
        ...prev,
        error: "Não foi possível acessar a câmera. Verifique as permissões.",
        hasPermission: false,
      }))
      return false
    }
  }, [cameraState.facingMode])

  const switchCamera = useCallback(async () => {
    if (cameraState.stream) {
      cameraState.stream.getTracks().forEach((track) => track.stop())
    }

    const newFacingMode = cameraState.facingMode === "user" ? "environment" : "user"
    setCameraState((prev) => ({ ...prev, facingMode: newFacingMode }))

    setTimeout(() => {
      requestCameraPermission()
    }, 100)
  }, [cameraState.stream, cameraState.facingMode, requestCameraPermission])

  const capturePhoto = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current) return null

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (!context) return null

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0)

    return canvas.toDataURL("image/jpeg", 0.8)
  }, [])

  const stopCamera = useCallback(() => {
    if (cameraState.stream) {
      cameraState.stream.getTracks().forEach((track) => track.stop())
    }

    setCameraState((prev) => ({
      ...prev,
      isOpen: false,
      stream: null,
    }))
  }, [cameraState.stream])

  return {
    cameraState,
    videoRef,
    canvasRef,
    requestCameraPermission,
    switchCamera,
    capturePhoto,
    stopCamera,
  }
}
