import { useState, useEffect } from 'react';
import { getReporte } from '../api/tareas';
import type { Reporte } from '../types';

export const Reportes = () => {
  const [reporte, setReporte] = useState<Reporte | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReporte().then(r => { setReporte(r); setLoading(false); });
  }, []);

  if (loading) return <div className="loading">Cargando reporte...</div>;
  if (!reporte) return null;

  const barras = [
    { label: 'Completadas', value: reporte.completadas, total: reporte.total, color: '#166534' },
    { label: 'En progreso', value: reporte.enProgreso, total: reporte.total, color: '#1a4fa0' },
    { label: 'Pendientes', value: reporte.pendientes, total: reporte.total, color: '#b45309' },
  ];

  const prioridades = [
    { label: 'Alta', value: reporte.alta, total: reporte.total, color: '#9b1c1c' },
    { label: 'Media', value: reporte.media, total: reporte.total, color: '#b45309' },
    { label: 'Baja', value: reporte.baja, total: reporte.total, color: '#166534' },
  ];

  return (
    <div className="reporte-page">
      <div className="perfil-header">
        <h1 className="topbar-title">Reportes</h1>
        <p className="topbar-sub">Análisis de tu productividad</p>
      </div>

      <div className="reporte-body">
        <div className="reporte-stats">
          <div className="r-stat">
            <div className="r-stat-value">{reporte.total}</div>
            <div className="r-stat-label">Total</div>
          </div>
          <div className="r-stat">
            <div className="r-stat-value" style={{ color: 'var(--green)' }}>{reporte.completadas}</div>
            <div className="r-stat-label">Completadas</div>
          </div>
          <div className="r-stat">
            <div className="r-stat-value" style={{ color: 'var(--blue)' }}>{reporte.enProgreso}</div>
            <div className="r-stat-label">En progreso</div>
          </div>
          <div className="r-stat">
            <div className="r-stat-value" style={{ color: 'var(--amber)' }}>{reporte.pendientes}</div>
            <div className="r-stat-label">Pendientes</div>
          </div>
        </div>

        <div className="reporte-grid">
          <div className="reporte-card">
            <h3 className="reporte-card-title">Progreso general</h3>
            <div className="progreso-circle-wrap">
              <div className="progreso-circle">
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="var(--surface2)" strokeWidth="10"/>
                  <circle
                    cx="50" cy="50" r="40" fill="none"
                    stroke="var(--green)" strokeWidth="10"
                    strokeDasharray={`${reporte.porcentajeCompletado * 2.51} 251`}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="progreso-label">
                  <span className="progreso-pct">{reporte.porcentajeCompletado}%</span>
                  <span className="progreso-sub">completado</span>
                </div>
              </div>
            </div>
          </div>

          <div className="reporte-card">
            <h3 className="reporte-card-title">Por estado</h3>
            <div className="bar-chart">
              {barras.map(b => (
                <div key={b.label} className="bar-row">
                  <span className="bar-name">{b.label}</span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{
                      width: b.total > 0 ? `${(b.value / b.total) * 100}%` : '0%',
                      background: b.color
                    }}/>
                  </div>
                  <span className="bar-count">{b.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="reporte-card">
            <h3 className="reporte-card-title">Por prioridad</h3>
            <div className="bar-chart">
              {prioridades.map(b => (
                <div key={b.label} className="bar-row">
                  <span className="bar-name">{b.label}</span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{
                      width: b.total > 0 ? `${(b.value / b.total) * 100}%` : '0%',
                      background: b.color
                    }}/>
                  </div>
                  <span className="bar-count">{b.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
