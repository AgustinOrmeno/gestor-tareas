import { useState, useEffect, FormEvent } from 'react';
import { getPerfil, actualizarNombre, cambiarPassword } from '../api/usuario';

export const Perfil = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [nombreEdit, setNombreEdit] = useState('');
  const [passwordActual, setPasswordActual] = useState('');
  const [passwordNueva, setPasswordNueva] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [msgNombre, setMsgNombre] = useState('');
  const [msgPassword, setMsgPassword] = useState('');
  const [errNombre, setErrNombre] = useState('');
  const [errPassword, setErrPassword] = useState('');
  const [loadingNombre, setLoadingNombre] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  useEffect(() => {
    getPerfil().then(p => {
      setNombre(p.nombre);
      setEmail(p.email);
      setNombreEdit(p.nombre);
    });
  }, []);

  const handleNombre = async (e: FormEvent) => {
    e.preventDefault();
    setErrNombre(''); setMsgNombre('');
    setLoadingNombre(true);
    try {
      const p = await actualizarNombre(nombreEdit);
      setNombre(p.nombre);
      setMsgNombre('Nombre actualizado correctamente');
    } catch {
      setErrNombre('Error al actualizar el nombre');
    } finally {
      setLoadingNombre(false);
    }
  };

  const handlePassword = async (e: FormEvent) => {
    e.preventDefault();
    setErrPassword(''); setMsgPassword('');
    if (passwordNueva !== passwordConfirm) {
      setErrPassword('Las contraseñas nuevas no coinciden');
      return;
    }
    if (passwordNueva.length < 6) {
      setErrPassword('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }
    setLoadingPassword(true);
    try {
      await cambiarPassword(passwordActual, passwordNueva);
      setMsgPassword('Contraseña actualizada correctamente');
      setPasswordActual(''); setPasswordNueva(''); setPasswordConfirm('');
    } catch (err: any) {
      setErrPassword(err.message || 'Error al cambiar la contraseña');
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div className="perfil-page">
      <div className="perfil-header">
        <h1 className="topbar-title">Mi perfil</h1>
        <p className="topbar-sub">Gestioná tu información personal</p>
      </div>

      <div className="perfil-body">
        {/* Avatar + info */}
        <div className="perfil-avatar-card">
          <div className="perfil-avatar">{nombre.charAt(0).toUpperCase()}</div>
          <div>
            <div className="perfil-nombre">{nombre}</div>
            <div className="perfil-email">{email}</div>
          </div>
        </div>

        {/* Editar nombre */}
        <div className="perfil-section">
          <h2 className="perfil-section-title">Información personal</h2>
          <form onSubmit={handleNombre}>
            {errNombre && <div className="error-msg">{errNombre}</div>}
            {msgNombre && <div className="success-msg">{msgNombre}</div>}
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                value={nombreEdit}
                onChange={e => setNombreEdit(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Correo electrónico</label>
              <input type="email" value={email} disabled className="input-disabled" />
              <span className="input-hint">El email no se puede modificar</span>
            </div>
            <div className="perfil-footer">
              <button type="submit" className="btn-confirm" disabled={loadingNombre}>
                {loadingNombre ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </form>
        </div>

        {/* Cambiar contraseña */}
        <div className="perfil-section">
          <h2 className="perfil-section-title">Cambiar contraseña</h2>
          <form onSubmit={handlePassword}>
            {errPassword && <div className="error-msg">{errPassword}</div>}
            {msgPassword && <div className="success-msg">{msgPassword}</div>}
            <div className="form-group">
              <label>Contraseña actual</label>
              <input
                type="password"
                value={passwordActual}
                onChange={e => setPasswordActual(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Nueva contraseña</label>
              <input
                type="password"
                value={passwordNueva}
                onChange={e => setPasswordNueva(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Confirmar nueva contraseña</label>
              <input
                type="password"
                value={passwordConfirm}
                onChange={e => setPasswordConfirm(e.target.value)}
                required
              />
            </div>
            <div className="perfil-footer">
              <button type="submit" className="btn-confirm" disabled={loadingPassword}>
                {loadingPassword ? 'Guardando...' : 'Cambiar contraseña'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
