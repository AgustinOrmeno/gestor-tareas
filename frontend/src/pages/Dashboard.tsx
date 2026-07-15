import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTareas, crearTarea, editarTarea, cambiarEstado, eliminarTarea, getHistorial } from '../api/tareas';
import { getPerfil } from '../api/usuario';
import { TareaForm } from '../components/TareaForm';
import type { Tarea, TareaRequest, HistorialItem } from '../types';

const PRIORIDAD_LABEL: Record<string, string> = { ALTA: 'Alta', MEDIA: 'Media', BAJA: 'Baja' };
const ESTADO_LABEL: Record<string, string> = { PENDIENTE: 'Pendiente', EN_PROGRESO: 'En progreso', COMPLETADA: 'Completada' };
const ESTADOS: Tarea['estado'][] = ['PENDIENTE', 'EN_PROGRESO', 'COMPLETADA'];

const isVencida = (tarea: Tarea) => {
  if (!tarea.fechaLimite || tarea.estado === 'COMPLETADA') return false;
  return new Date(tarea.fechaLimite) < new Date(new Date().toDateString());
};

const getFechaHoy = () => {
  const d = new Date();
  return d.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
};

export const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [orden, setOrden] = useState('fechaCreacion_desc');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState<Tarea | null>(null);
  const [seleccionada, setSeleccionada] = useState<Tarea | null>(null);
  const [historial, setHistorial] = useState<HistorialItem[]>([]);
  const [loadingHistorial, setLoadingHistorial] = useState(false);
  const [error, setError] = useState('');
  const [usuario, setUsuario] = useState({ nombre: '', email: '' });

  useEffect(() => {
    getPerfil().then(p => setUsuario(p)).catch(() => {});
  }, []);

  const cargarTareas = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getTareas(filtroEstado || undefined);
      setTareas(data);
    } catch {
      setError('Error al cargar las tareas');
    } finally {
      setLoading(false);
    }
  }, [filtroEstado]);

  useEffect(() => { cargarTareas(); }, [cargarTareas]);

  const cargarHistorial = async (tarea: Tarea) => {
    setSeleccionada(tarea);
    setLoadingHistorial(true);
    try {
      const h = await getHistorial(tarea.id);
      setHistorial(h);
    } catch {
      setHistorial([]);
    } finally {
      setLoadingHistorial(false);
    }
  };

  const tareasFiltradas = useMemo(() => {
    let result = tareas;
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      result = result.filter(t =>
        t.titulo.toLowerCase().includes(q) ||
        (t.descripcion && t.descripcion.toLowerCase().includes(q))
      );
    }
    return [...result].sort((a, b) => {
      switch (orden) {
        case 'titulo_asc': return a.titulo.localeCompare(b.titulo);
        case 'prioridad_desc': { const p = { BAJA: 0, MEDIA: 1, ALTA: 2 }; return p[b.prioridad] - p[a.prioridad]; }
        case 'fecha_asc': return (a.fechaLimite || '').localeCompare(b.fechaLimite || '');
        default: return new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime();
      }
    });
  }, [tareas, busqueda, orden]);

  const handleCrear = async (data: TareaRequest) => {
    await crearTarea(data);
    setShowForm(false);
    cargarTareas();
  };

  const handleEditar = async (data: TareaRequest) => {
    if (!editando) return;
    await editarTarea(editando.id, data);
    setEditando(null);
    cargarTareas();
    if (seleccionada?.id === editando.id) setSeleccionada(null);
  };

  const handleCambiarEstado = async (id: number, estado: string) => {
    await cambiarEstado(id, estado);
    await cargarTareas();
    if (seleccionada?.id === id) {
      const updated = tareas.find(t => t.id === id);
      if (updated) cargarHistorial({ ...updated, estado: estado as Tarea['estado'] });
    }
  };

  const handleEliminar = async (id: number) => {
    if (!confirm('¿Eliminar esta tarea?')) return;
    await eliminarTarea(id);
    if (seleccionada?.id === id) setSeleccionada(null);
    cargarTareas();
  };

  const pendientes = tareas.filter(t => t.estado === 'PENDIENTE').length;
  const enProgreso = tareas.filter(t => t.estado === 'EN_PROGRESO').length;
  const completadas = tareas.filter(t => t.estado === 'COMPLETADA').length;
  const vencidas = tareas.filter(isVencida).length;

  const chips = [
    { label: 'Todas', value: '' },
    { label: 'Pendiente', value: 'PENDIENTE' },
    { label: 'En progreso', value: 'EN_PROGRESO' },
    { label: 'Completada', value: 'COMPLETADA' },
  ];

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">✓</div>
          <span className="logo-text">Gestor de Tareas</span>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section-label">General</div>
          <div className="nav-item active">📋 Mis tareas {pendientes > 0 && <span className="nav-badge">{pendientes}</span>}</div>
          <div className="nav-item" onClick={() => navigate('/equipo')}>👥 Mi equipo</div>
          <div className="nav-section-label">Análisis</div>
          <div className="nav-item" onClick={() => navigate('/reportes')}>📊 Reportes</div>
          <div className="nav-item" onClick={() => navigate('/historial')}>🕐 Historial</div>
        </nav>
        <div className="sidebar-bottom">
          <div className="nav-item" onClick={() => navigate('/perfil')}>👤 Mi perfil</div>
          <div className="plan-chip">Plan gratuito</div>
          <button className="btn-logout" onClick={logout}>Cerrar sesión</button>
        </div>
      </aside>

      <main className="main-content">
        <div className="topbar">
          <div>
            <h1 className="topbar-title">Dashboard</h1>
            <p className="topbar-sub">{getFechaHoy()}</p>
          </div>
          <div className="topbar-right">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Buscar tareas..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
              />
              {busqueda && <button className="search-clear" onClick={() => setBusqueda('')}>✕</button>}
            </div>
            <button className="btn-primary" onClick={() => setShowForm(true)}>+ Nueva tarea</button>
          </div>
        </div>

        <div className="stats-row">
          <div className="stat-card"><div className="stat-label">Total</div><div className="stat-value">{tareas.length}</div></div>
          <div className="stat-card"><div className="stat-label">Pendientes</div><div className="stat-value amber">{pendientes}</div></div>
          <div className="stat-card"><div className="stat-label">En progreso</div><div className="stat-value blue">{enProgreso}</div></div>
          <div className="stat-card"><div className="stat-label">Completadas</div><div className="stat-value green">{completadas}</div></div>
          {vencidas > 0 && <div className="stat-card stat-card-vencida"><div className="stat-label">Vencidas</div><div className="stat-value red">{vencidas}</div></div>}
        </div>

        <div className="content-area">
          <div className="task-list-col">
            <div className="chips-bar">
              {chips.map(c => (
                <button
                  key={c.value}
                  className={`filter-chip ${filtroEstado === c.value ? 'active' : ''}`}
                  onClick={() => setFiltroEstado(c.value)}
                >{c.label}</button>
              ))}
              <select value={orden} onChange={e => setOrden(e.target.value)} className="sort-select" style={{ marginLeft: 'auto' }}>
                <option value="fechaCreacion_desc">Más recientes</option>
                <option value="prioridad_desc">Mayor prioridad</option>
                <option value="fecha_asc">Fecha límite ↑</option>
                <option value="titulo_asc">Título A–Z</option>
              </select>
            </div>

            {error && <div className="error-msg" style={{ margin: '0 0 8px' }}>{error}</div>}

            {loading ? (
              <div className="loading">Cargando tareas...</div>
            ) : tareasFiltradas.length === 0 ? (
              <div className="empty-state">
                {busqueda ? <p>Sin resultados para "<strong>{busqueda}</strong>"</p> : (
                  <><p>No hay tareas todavía.</p><button className="btn-primary" onClick={() => setShowForm(true)}>Crear primera tarea</button></>
                )}
              </div>
            ) : (
              <div className="task-list">
                {tareasFiltradas.map(tarea => {
                  const vencida = isVencida(tarea);
                  const isSelected = seleccionada?.id === tarea.id;
                  return (
                    <div
                      key={tarea.id}
                      className={`task-card ${tarea.estado === 'COMPLETADA' ? 'done' : ''} ${vencida ? 'vencida' : ''} ${isSelected ? 'selected' : ''}`}
                      onClick={() => cargarHistorial(tarea)}
                    >
                      <div className="task-card-top">
                        <div className="task-info">
                          <h3 className="task-title">{tarea.titulo}</h3>
                          {tarea.descripcion && <p className="task-desc">{tarea.descripcion}</p>}
                          <div className="task-meta">
                            {tarea.fechaLimite && (
                              <span className={vencida ? 'fecha-vencida' : ''}>
                                📅 {tarea.fechaLimite}
                                {vencida && <span className="badge-vencida">Vencida</span>}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="task-badges">
                          <span className={`badge badge-prioridad ${tarea.prioridad.toLowerCase()}`}>{PRIORIDAD_LABEL[tarea.prioridad]}</span>
                          <span className={`badge badge-estado ${tarea.estado.toLowerCase()}`}>{ESTADO_LABEL[tarea.estado]}</span>
                        </div>
                      </div>
                      <div className="task-card-actions" onClick={e => e.stopPropagation()}>
                        <select value={tarea.estado} onChange={e => handleCambiarEstado(tarea.id, e.target.value)} className="estado-select">
                          {ESTADOS.map(e => <option key={e} value={e}>{ESTADO_LABEL[e]}</option>)}
                        </select>
                        <button className="btn-icon" onClick={() => setEditando(tarea)} title="Editar">✏️</button>
                        <button className="btn-icon danger" onClick={() => handleEliminar(tarea.id)} title="Eliminar">🗑️</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {seleccionada && (
            <div className="detail-panel">
              <div className="detail-header">
                <span className="detail-section-label">Detalle de tarea</span>
                <button className="modal-close" onClick={() => setSeleccionada(null)}>✕</button>
              </div>
              <div className="detail-title">{seleccionada.titulo}</div>
              {seleccionada.descripcion && <p className="detail-desc">{seleccionada.descripcion}</p>}

              <div className="detail-field">
                <div className="detail-section-label">Estado</div>
                <span className={`badge badge-estado ${seleccionada.estado.toLowerCase()}`}>{ESTADO_LABEL[seleccionada.estado]}</span>
              </div>

              <div className="detail-field">
                <div className="detail-section-label">Prioridad</div>
                <span className={`badge badge-prioridad ${seleccionada.prioridad.toLowerCase()}`}>{PRIORIDAD_LABEL[seleccionada.prioridad]}</span>
              </div>

              {seleccionada.fechaLimite && (
                <div className="detail-field">
                  <div className="detail-section-label">Fecha límite</div>
                  <div className="detail-value">📅 {seleccionada.fechaLimite}</div>
                </div>
              )}

              <div className="detail-field">
                <div className="detail-section-label">Historial de cambios</div>
                {loadingHistorial ? (
                  <div style={{ fontSize: '12px', color: 'var(--text3)' }}>Cargando...</div>
                ) : historial.length === 0 ? (
                  <div style={{ fontSize: '12px', color: 'var(--text3)' }}>Sin cambios registrados</div>
                ) : (
                  <div className="historial-list">
                    {historial.map(h => (
                      <div key={h.id} className="history-item">
                        <div className={`history-dot ${h.estadoAnterior ? '' : 'muted'}`}/>
                        <div className="history-text">
                          {h.estadoAnterior
                            ? <>{ESTADO_LABEL[h.estadoAnterior]} → <strong>{ESTADO_LABEL[h.estadoNuevo]}</strong></>
                            : <>Tarea creada como <strong>{ESTADO_LABEL[h.estadoNuevo]}</strong></>
                          }
                          <div style={{ color: 'var(--text3)', fontSize: '10.5px' }}>{h.fecha}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="detail-actions">
                <button className="btn-action" onClick={() => { setEditando(seleccionada); setSeleccionada(null); }}>✏️ Editar tarea</button>
                <button className="btn-action danger" onClick={() => handleEliminar(seleccionada.id)}>🗑️ Eliminar tarea</button>
              </div>
            </div>
          )}
        </div>
      </main>

      {showForm && <TareaForm titulo="Nueva tarea" onSubmit={handleCrear} onCancel={() => setShowForm(false)} />}
      {editando && <TareaForm titulo="Editar tarea" inicial={editando} onSubmit={handleEditar} onCancel={() => setEditando(null)} />}
    </div>
  );
};
