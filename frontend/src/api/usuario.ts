import client from './client';

export const getPerfil = async (): Promise<{ nombre: string; email: string }> => {
  const { data } = await client.get('/api/usuarios/perfil');
  return data;
};

export const actualizarNombre = async (nombre: string): Promise<{ nombre: string; email: string }> => {
  const { data } = await client.put('/api/usuarios/perfil', { nombre });
  return data;
};

export const cambiarPassword = async (passwordActual: string, passwordNueva: string): Promise<void> => {
  const { data } = await client.put('/api/usuarios/password', { passwordActual, passwordNueva });
  if (data.error) throw new Error(data.error);
};
