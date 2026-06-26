import client from './client';
import type { AuthResponse } from '../types';

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const { data } = await client.post('/api/auth/login', { email, password });
  return data;
};

export const register = async (nombre: string, email: string, password: string): Promise<AuthResponse> => {
  const { data } = await client.post('/api/auth/register', { nombre, email, password });
  return data;
};
