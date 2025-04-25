export enum Ciudad {
    Bucaramanga = 'Bucaramanga',
    Piedecuesta = 'Piedecuesta',
    Floridablanca = 'Floridablanca',
    Giron = 'Girón'
  }
  
  export interface ClienteRead {
    documento: string;
    nombre: string;
    apellido_1: string;
    apellido_2: string | null;
    direccion: string | null;
    telefono: string | null;
    correo_electronico: string;
    ciudad: Ciudad;
    id_condicion_pago: number;
    valor_cupo: string | number | null;
    id_medio_pago: number | null; 
    estado: boolean; 
    fecha_hora_auditoria: string;
  }
  
  export interface ClienteCreate {
    documento: string;
    nombre: string;
    apellido_1: string;
    apellido_2?: string | null; 
    direccion?: string | null;
    telefono?: string | null;
    correo_electronico: string;
    ciudad: Ciudad;
    id_condicion_pago: number;
    valor_cupo?: string | number | null; 
    id_medio_pago?: number | null;
    estado: boolean;
  }
  
  export interface ClienteUpdate {
    nombre?: string;
    apellido_1?: string;
    apellido_2?: string | null;
    direccion?: string | null;
    telefono?: string | null;
    correo_electronico?: string;
    ciudad?: Ciudad;
    id_condicion_pago?: number;
    valor_cupo?: string | number | null;
    id_medio_pago?: number | null; 
    estado?: boolean;
  }
  
  export interface EstadoUpdate {
    estado: boolean;
  }