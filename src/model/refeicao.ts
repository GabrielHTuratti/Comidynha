import mongoose, { ObjectId, Schema } from 'mongoose';

export type RefeicaoTipo = "cafe-da-manha" | "almoco" | "lanche-da-tarde" | "janta"

export interface nutridesc {
  proteinas?: string,
  carboidratos?: string,
  gorduras?: string,
  extra?: Record<string, string>
}


export interface IRefeicao {
  useremail: string,
  refid: string,
  nome: string;
  favorito: boolean,
  desc: nutridesc,
  calorias: number;
  data: string;
  tipo: RefeicaoTipo;
}

const esquemaRefeicao: Schema = new Schema({
  useremail: {type: String, required: true},
  refid: {type: String, required: true},
  nome: { type: String, required: true },
  favorito: {type: Boolean, required: true},
  desc: { 
    proteinas: { type: String, default: "" },
    carboidratos: { type: String, default: "" },
    gorduras: { type: String, default: "" },
    extra: { type: Schema.Types.Mixed, default: {} }
  },
  calorias: { type: Number, required: true },
  data: { type: Date, required: true, default: Date.now },
  tipo: { 
    type: String, 
    required: true,
    enum: ['cafe-da-manha', 'almoco', 'lanche-da-tarde', 'janta']
  }
});

export default mongoose.models.MDB_refeicoes || mongoose.model<IRefeicao>('MDB_refeicoes', esquemaRefeicao);