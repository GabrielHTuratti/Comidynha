import mongoose, { Schema } from "mongoose"


export interface IIngredienteItem {
  refid: string
  nome: string
  categoria: string
  calorias_por_100g: number
  proteinas_por_100g: number
  carboidratos_por_100g: number
  gorduras_por_100g: number
  fibras_por_100g: number
  vitaminas: Map<string, number>
  minerais: Map<string, number>
  descricao: string
  tags: string[]
  origem: "manual" | "detectado" | "importado"
  data_criacao: Date
  data_atualizacao: Date
  confianca: number
  quantidade_estimada: string
}

export interface IIngrediente {
  _id: string
  userEmail: string
  ingredientes: IIngredienteItem[] 
}

export const IngredienteItemSchema: Schema = new Schema({
  refid: {
    type: String,
    required: true,
  },
  nome: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    index: true,
  },
  categoria: {
    type: String,
    required: true,
    enum: [
      "Vegetais",
      "Frutas",
      "Carnes",
      "Peixes",
      "Laticínios",
      "Cereais",
      "Leguminosas",
      "Oleaginosas",
      "Temperos",
      "Condimentos",
      "Bebidas",
      "Outros",
    ],
  },
  calorias_por_100g: {
    type: Number,
    required: true,
    min: 0,
  },
  proteinas_por_100g: {
    type: Number,
    required: true,
    min: 0,
  },
  carboidratos_por_100g: {
    type: Number,
    required: true,
    min: 0,
  },
  gorduras_por_100g: {
    type: Number,
    required: true,
    min: 0,
  },
  fibras_por_100g: {
    type: Number,
    default: 0,
    min: 0,
  },
  vitaminas: {
    type: Map,
    of: Number,
    default: new Map(),
  },
  minerais: {
    type: Map,
    of: Number,
    default: new Map(),
  },
  descricao: {
    type: String,
    required: true,
    trim: true,
  },
  tags: [
    {
      type: String,
      trim: true,
      lowercase: true,
    },
  ],
  origem: {
    type: String,
    enum: ["manual", "detectado", "importado"],
    default: "detectado",
  },
  data_criacao: {
    type: Date,
    default: Date.now,
  },
  data_atualizacao: {
    type: Date,
    default: Date.now,
  },
}, { _id: false }); 

const IngredienteSchema: Schema = new Schema({
  userEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  ingredientes: {
      type: [IngredienteItemSchema],
      required: true,
      validate: {
        validator: (v: IIngredienteItem[]) => Array.isArray(v) && v.length > 0,
        message: "Deve conter pelo menos 1 ingrediente"
      }
    },
}, {
  timestamps: { createdAt: "data_criacao", updatedAt: "data_atualizacao" },
});

IngredienteSchema.pre("save", function (next) {
  this.data_atualizacao = new Date();
    if (this.isModified('ingredientes')) {
    const raw_doc = this.toObject();
    const jsoned_doc = raw_doc.ingredientes as IIngredienteItem[]
    jsoned_doc.forEach((ing: { data_atualizacao: Date }) => {
      ing.data_atualizacao = new Date();
    });
  }
  
  next();
});

export default mongoose.models.MDB_ingredients || 
       mongoose.model<IIngrediente>("MDB_ingredients", IngredienteSchema);