"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Upload, Camera, Loader2 } from "lucide-react"
import Image from "next/image"
import { ImageUploadProps } from "@/types/intelligent-meal"



export function ImageUpload({ selectedImage, onImageSelect, onAnalyze, isAnalyzing }: ImageUploadProps) {
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64 = e.target?.result as string
        onImageSelect(base64)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
        <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-3">
          <div className="p-3 bg-gray-100 rounded-full">
            <Upload className="h-6 w-6 text-gray-600" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-900">Clique para fazer upload</p>
            <p className="text-xs text-gray-500">PNG, JPG até 10MB</p>
          </div>
        </label>
      </div>

      {/* Image Preview */}
      {selectedImage && (
        <div className="space-y-4">
          <div className="relative rounded-lg overflow-hidden border">
            <Image
              src={selectedImage || "/placeholder.svg"}
              alt="Ingredientes para análise"
              width={400}
              height={300}
              className="w-full h-64 object-cover"
            />
          </div>

          <Button onClick={onAnalyze} disabled={isAnalyzing} className="w-full" size="lg">
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analisando ingredientes...
              </>
            ) : (
              <>
                <Camera className="h-4 w-4 mr-2" />
                Detectar Ingredientes
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
