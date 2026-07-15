import { useState, useEffect } from 'react';
import { getHistorialCompleto } from '../api/tareas';
import type { HistorialItem } from '../types';

const ESTADO_LABEL: Record<string, string> = {
  PENDIENTE: 'Pendiente', EN_PROGRESO: 'En progreso', COMPLETADA: 'Completada'
};

const ESTADO_COLOR: Record<string, string> = {
  PENDIENTE: 'var(--amber)', EN_PROGRESO: 'var(--blue)', COMPLETADA: 'var(--green)'
};

export const Historial = () => {
  const [historial, setHistorial] = useState<HistorialItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHistorialCompleto()
      .then(h => { setHistorial(h); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="perfil-page">
      <div className="perfil-header">
        <h1 className="topbar-title">Historial</h1>
        <p className="topbar-sub">Registro de actividad de tus tareas</p>
      </div>

      <div className="historial-page-body">
        {loading ? (
          <div className="loading">Cargando historial...</div>
        ) : historial.length === 0 ? (
          <div className="empty-state">
            <p>No hay actividad registrada todavía.</p>
          </div>
        ) : (
          <div className="timeline">
            {historial.map((h, i) => (
              <div key={h.id} className="timeline-item">
                <div className="timeline-line-wrap">
                  <div className="timeline-dot" style={{ background: ESTADO_COLOR[h.estadoNuevo] }}/>
                  {i < historial.length - 1 && <div className="timeline-line"/>}
                </div>
                <div className="timeline-content">
                  <div className="timeline-tarea">{h.tareaTitulo}</div>
                  <div className="timeline-desc">
                    {h.estadoAnterior ? (
                      <>
                        <span className="tl-badge" style={{ background: `${ESTADO_COLOR[h.estadoAnterior]}20`, color: ESTADO_COLOR[h.estadoAnterior] }}>
                          {ESTADO_LABEL[h.estadoAnterior]}
                        </span>
                        {' → '}
                        <span className="tl-badge" style={{ background: `${ESTADO_COLOR[h.estadoNuevo]}20`, color: ESTADO_COLOR[h.estadoNuevo] }}>
                          {ESTADO_LABEL[h.estadoNuevo]}
                        </span>
                      </>
                    ) : (
                      <>Tarea creada como <span className="tl-badge" style={{ background: `${ESTADO_COLOR[h.estadoNuevo]}20`, color: ESTADO_COLOR[h.estadoNuevo] }}>{ESTADO_LABEL[h.estadoNuevo]}</span></>
                    )}
                  </div>
                  <div className="timeline-meta">{h.usuario} · {h.fecha}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
