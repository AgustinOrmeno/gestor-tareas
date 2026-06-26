import client from './client';
import type { Tarea, TareaRequest } from '../types';

export const getTareas = async (estado?: string, prioridad?: string): Promise<Tarea[]> => {
  const params: Record<string, string> = {};
  if (estado) params.estado = estado;
  if (prioridad) params.prioridad = prioridad;
  const { data } = await client.get('/api/tareas', { params });
  return data;
};

export const crearTarea = async (tarea: TareaRequest): Promise<Tarea> => {
  const { data } = await client.post('/api/tareas', tarea);
  return data;
};

export const editarTarea = async (id: number, tarea: TareaRequest): Promise<Tarea> => {
  const { data } = await client.put(`/api/tareas/${id}`, tarea);
  return data;
};

export const cambiarEstado = async (id: number, estado: string): Promise<Tarea> => {
  const { data } = await client.patch(`/api/tareas/${id}/estado`, { estado });
  return data;
};

export const eliminarTarea = async (id: number): Promise<void> => {
  await client.delete(`/api/tareas/${id}`);
};
