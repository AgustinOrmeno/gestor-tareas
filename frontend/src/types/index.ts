export interface Tarea {
  id: number;
  titulo: string;
  descripcion: string;
  prioridad: 'BAJA' | 'MEDIA' | 'ALTA';
  estado: 'PENDIENTE' | 'EN_PROGRESO' | 'COMPLETADA';
  fechaLimite: string | null;
  fechaCreacion: string;
  usuarioNombre: string;
}

export interface TareaRequest {
  titulo: string;
  descripcion: string;
  prioridad: 'BAJA' | 'MEDIA' | 'ALTA';
  fechaLimite: string | null;
}

export interface AuthResponse {
  token: string;
}

export interface HistorialItem {
  id: number;
  estadoAnterior: string | null;
  estadoNuevo: string;
  usuario: string;
  fecha: string;
  tareaTitulo?: string;
  tareaId?: number;
}

export interface Reporte {
  total: number;
  pendientes: number;
  enProgreso: number;
  completadas: number;
  alta: number;
  media: number;
  baja: number;
  porcentajeCompletado: number;
}
