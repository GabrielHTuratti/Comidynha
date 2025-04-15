"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import type { ToastActionElement } from "@/components/ui/toast"
export const confirmToast = (
  toast: (props: {
    title?: string
    description?: React.ReactNode
    action?: ToastActionElement
    duration?: number
  }) => void,
  mensagem: string,
  onConfirm: () => void,
) => {
  return toast({
    title: "Confirmação",
    description: (
      <div className="mt-2">
        <p className="mb-4">{mensagem}</p>
        <div className="flex justify-end space-x-2">
          <Button
            size="sm"
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={() => {
              onConfirm()
            }}
          >
            Confirmar
          </Button>
        </div>
      </div>
    ),
    duration: 4000,
  })
}
