
export type StatusServico = "publicado" | "rascunho" | "cancelado" | "concluido";
export type StatusPedido = "pendente" | "aceito" | "recusado" | "em_andamento" | "concluido";
export type StatusEquipamento = "disponivel" | "em_uso" | "manutencao" | "descartado";


export interface Usuario {
  email: String;
  name: String;
  role: String;
}

export interface Cliente {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  avatar?: string;
  endereco?: {
    rua: string;
    numero: string;
    cidade: string;
    estado: string;
  };
}

export interface Servico {
  id: string;
  titulo: string;
  descricao: string;
  tipo: string;
  dataRealizacao: string | Date;
  valor: number;
  cliente: Cliente;
  imagens: string[];
  status: StatusServico;
  createdAt?: string | Date; 
  updatedAt?: string | Date; 
}

export interface Pedido {
  id: string;
  cliente: Cliente; 
  tipo: string;
  descricao: string;
  data: string | Date;
  endereco: string;
  status: StatusPedido;
  valor?: number;
  avatar?: string;
  observacoes?: string;
  servicoRelacionado?: string | Servico; 
}


export interface ServicoFormValues extends Omit<Servico, 'id' | 'cliente' | 'imagens'> {
  clienteId: string;
  imagens: FileList | string[];
}

export interface PedidoFormValues extends Omit<Pedido, 'id' | 'data'> {
  data: string; 
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}