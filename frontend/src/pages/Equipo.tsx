import { useState, useEffect } from 'react';
import { getPerfil } from '../api/usuario';

export const Equipo = () => {
  const [perfil, setPerfil] = useState({ nombre: '', email: '' });

  useEffect(() => {
    getPerfil().then(p => setPerfil(p)).catch(() => {});
  }, []);

  const inicial = perfil.nombre ? perfil.nombre.charAt(0).toUpperCase() : '?';

  return (
    <div className="perfil-page">
      <div className="perfil-header">
        <h1 className="topbar-title">Mi equipo</h1>
        <p className="topbar-sub">Gestioná los miembros de tu equipo</p>
      </div>

      <div className="perfil-body">
        <div className="equipo-topbar">
          <div>
            <h2 className="perfil-section-title" style={{ border: 'none', padding: 0, margin: 0 }}>Miembros</h2>
            <p style={{ fontSize: '12.5px', color: 'var(--text3)', marginTop: 2 }}>Plan gratuito · 1 de 3 miembros</p>
          </div>
          <button className="btn-primary" style={{ opacity: 0.5, cursor: 'not-allowed' }} disabled title="Disponible en Plan Pro">
            + Invitar miembro
          </button>
        </div>

        <div className="perfil-section" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="equipo-table">
            <thead>
              <tr>
                <th>Miembro</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="member-cell">
                    <div className="avatar-sm avatar-blue">{inicial}</div>
                    <span>{perfil.nombre || 'Usuario'}</span>
                  </div>
                </td>
                <td style={{ color: 'var(--text2)', fontSize: '13px' }}>{perfil.email}</td>
                <td><span className="role-badge role-admin">Administrador</span></td>
                <td><span className="role-badge role-active">Activo</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="plan-banner">
          <div className="plan-banner-icon">⭐</div>
          <div>
            <div className="plan-banner-title">Actualizá a Plan Pro</div>
            <div className="plan-banner-sub">Invitá hasta 20 miembros, asigná tareas y accedé a reportes avanzados.</div>
          </div>
          <button className="btn-primary" style={{ flexShrink: 0 }}>Ver planes</button>
        </div>
      </div>
    </div>
  );
};
