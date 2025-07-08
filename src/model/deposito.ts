import { ShortIngredientsProps } from "@/types/intelligent-meal"
import mongoose, { Schema } from "mongoose"
import { IIngredienteItem } from "./ingrediente"

export type ObjetivoDeposito =
  | "ganho-muscular"
  | "perda-peso"
  | "manutencao"
  | "receitas-doces"
  | "jantar-romantico"
  | "almoco-rapido"
  | "cafe-da-manha"
  | "lanche-saudavel"
  | "comida-vegana"
  | "low-carb"
  | "dieta-mediterranea"
  | "personalizado"

export interface IDeposito extends IDepositoInput{
  _id: string
  sugestoes_geradas: {
    receitas: Array<{
      nome: string
      ingredientes_usados: string[]
      ingredientes_extras?: string[]
      modo_preparo: string[]
      tempo_preparo: number
      dificuldade: "facil" | "medio" | "dificil"
      calorias_estimadas: number
      macros: {
        proteinas: number
        carboidratos: number
        gorduras: number
      }
      tags: string[]
      confianca: number
    }>
    refeicoes: Array<{
      nome: string
      tipo: "cafe-da-manha" | "almoco" | "lanche-da-tarde" | "janta"
      ingredientes_principais: string[]
      ingredientes_complementares?: string[]
      observacoes: string
      calorias_estimadas: number
      macros: {
        proteinas: number
        carboidratos: number
        gorduras: number
      }
      confianca: number
    }>
    dicas_nutricionais: string[]
    combinacoes_sugeridas: Array<{
      ingredientes: string[]
      beneficio: string
      quando_consumir: string
    }>
  }
  data_criacao: Date
  data_atualizacao: Date
}

export interface IDepositoInput {
  nome: string
  descricao: string
  objetivo: ObjetivoDeposito
  objetivo_personalizado?: string
  userEmail: string
  ingredientes: ShortIngredientsProps[] // Array de nomes de ingredientes (sem IDs únicos)
  configuracao: {
    calorias_alvo?: number
    proteinas_min?: number
    carboidratos_max?: number
    gorduras_max?: number
    fibras_min?: number
    restricoes_alimentares: string[]
    preferencias: string[]
  }
  ultima_sugestao?: Date
}


const ShortItemPropsSchema: Schema = new Schema({
  refid: {
    type: String,
    required: true
  },
  nome: {
    type: String,
    required: true,
    trim: true,
  }
})

const DepositoSchema: Schema = new Schema(
  {
    nome: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    descricao: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    objetivo: {
      type: String,
      required: true,
      enum: [
        "ganho-muscular",
        "perda-peso",
        "manutencao",
        "receitas-doces",
        "jantar-romantico",
        "almoco-rapido",
        "cafe-da-manha",
        "lanche-saudavel",
        "comida-vegana",
        "low-carb",
        "dieta-mediterranea",
        "personalizado",
      ],
    },
    objetivo_personalizado: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    userEmail: {
      type: String,
      required: true,
      index: true,
    },
    ingredientes: {
      type: [ShortItemPropsSchema],
      required: true,
      validate: {
        validator: (v: IIngredienteItem[]) => Array.isArray(v) && v.length > 0,
        message: "Deve conter pelo menos 1 ingrediente"
      }
    },
    configuracao: {
      calorias_alvo: {
        type: Number,
        min: 0,
        max: 5000,
      },
      proteinas_min: {
        type: Number,
        min: 0,
        max: 500,
      },
      carboidratos_max: {
        type: Number,
        min: 0,
        max: 1000,
      },
      gorduras_max: {
        type: Number,
        min: 0,
        max: 300,
      },
      fibras_min: {
        type: Number,
        min: 0,
        max: 100,
      },
      restricoes_alimentares: [
        {
          type: String,
          trim: true,
          lowercase: true,
        },
      ],
      preferencias: [
        {
          type: String,
          trim: true,
          lowercase: true,
        },
      ],
    },
    sugestoes_geradas: {
      receitas: [
        {
          nome: String,
          ingredientes_usados: [String],
          ingredientes_extras: [String],
          modo_preparo: [String],
          tempo_preparo: Number,
          dificuldade: {
            type: String,
            enum: ["facil", "medio", "dificil"],
          },
          calorias_estimadas: Number,
          macros: {
            proteinas: Number,
            carboidratos: Number,
            gorduras: Number,
          },
          tags: [String],
          confianca: Number,
        },
      ],
      refeicoes: [
        {
          nome: String,
          tipo: {
            type: String,
            enum: ["cafe-da-manha", "almoco", "lanche-da-tarde", "janta"],
          },
          ingredientes_principais: [String],
          ingredientes_complementares: [String],
          observacoes: String,
          calorias_estimadas: Number,
          macros: {
            proteinas: Number,
            carboidratos: Number,
            gorduras: Number,
          },
          confianca: Number,
        },
      ],
      dicas_nutricionais: [String],
      combinacoes_sugeridas: [
        {
          ingredientes: [String],
          beneficio: String,
          quando_consumir: String,
        },
      ],
    },
    data_criacao: {
      type: Date,
      default: Date.now,
    },
    data_atualizacao: {
      type: Date,
      default: Date.now,
    },
    ultima_sugestao: {
      type: Date,
    },
  },
  {
    timestamps: { createdAt: "data_criacao", updatedAt: "data_atualizacao" },
  },
)

export default mongoose.models.MDB_ingredient_deposits || mongoose.model<IDeposito>("MDB_ingredient_deposits", DepositoSchema)
