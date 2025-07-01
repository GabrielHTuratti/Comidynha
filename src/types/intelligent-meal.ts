export interface DetectedMeal {
  name: string
  ingredients: string[]
  nutrition: {
    calories: number
    protein: string
    carbs: string
    fat: string
  }
  confidence: number
  suggestions?: string[]
}

export interface CameraState {
  isOpen: boolean
  stream: MediaStream | null
  facingMode: "user" | "environment"
  hasPermission: boolean
  error: string | null
}

export interface AnalysisState {
  isAnalyzing: boolean
  result: DetectedMeal | null
  error: string | null
}

export type ProcessStage = "selection" | "camera" | "preview" | "analysis" | "confirmation"
