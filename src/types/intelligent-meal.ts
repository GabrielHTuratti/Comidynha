import { IDeposito, IDepositoInput, ObjetivoDeposito } from "@/model/deposito"
import { IIngredienteItem } from "@/model/ingrediente"
import { IRefeicao } from "@/model/refeicao"

export interface CameraState {
  isOpen: boolean
  stream: MediaStream | null
  facingMode: "user" | "environment"
  hasPermission: boolean
  error: string | null
}

export interface DepositosManagerProps {
  userEmail: string
}

export interface ShortIngredientsProps{
  refid: string
  nome: string
}


export interface IngredientCardProps {
  ingrediente: IIngredienteItem
  onUpdate: (ingrediente: IIngredienteItem) => void
  onRemove: () => void
}

export interface ImageUploadProps {
  selectedImage: string | null
  onImageSelect: (image: string) => void
  onAnalyze: () => void
  isAnalyzing: boolean
}

export interface DetectionResultsProps {
  result: {
    ingredientes: IIngredienteItem[]
    confiancaMedia?: number
    observacoes?: string
  }
  onSave: (ingredientes: IIngredienteItem[]) => Promise<void>
  onCancel: () => void
}

export interface CreateDepositoDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onCreateDeposito: (deposito: IFormDeposito) => void
  ingredientesDisponiveis: ShortIngredientsProps[]
  userEmail: string
}

export interface DepositoCardProps {
  deposito: IDeposito
  onGenerateSuggestions: (depositoId: string) => void
  onEdit: (deposito: IDepositoInput) => void
  onDelete: (depositoId: string) => void
  isGenerating?: boolean
}

export interface DetectionResult {
  ingredientes: IIngredienteItem[]
  confianca_geral: number
  observacoes: string
  total_detectados: number
  novos_ingredientes: number
}

export interface IFormConfiguracao {
  calorias_alvo: string;
  proteinas_min: string;
  carboidratos_max: string;
  gorduras_max: string;
  fibras_min: string;
  restricoes_alimentares: string[];
  preferencias: string[];
}

export interface IFormDeposito {
  nome: string;
  descricao: string;
  objetivo: ObjetivoDeposito | "";
  objetivo_personalizado: string;
  ingredientes: ShortIngredientsProps[];
  configuracao: IFormConfiguracao;
}

export interface AnalysisState {
  isAnalyzing: boolean
  result: IRefeicao | null
  error: string | null
}

export type ProcessStage = "selection" | "camera" | "preview" | "analysis" | "confirmation"
