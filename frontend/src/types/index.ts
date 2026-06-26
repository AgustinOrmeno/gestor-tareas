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
