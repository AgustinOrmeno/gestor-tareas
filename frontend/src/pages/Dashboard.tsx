import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTareas, crearTarea, editarTarea, cambiarEstado, eliminarTarea } from '../api/tareas';
import { TareaForm } from '../components/TareaForm';
import type { Tarea, TareaRequest } from '../types';

const PRIORIDAD_LABEL: Record<string, string> = { ALTA: 'Alta', MEDIA: 'Media', BAJA: 'Baja' };
const ESTADO_LABEL: Record<string, string> = { PENDIENTE: 'Pendiente', EN_PROGRESO: 'En progreso', COMPLETADA: 'Completada' };
const ESTADOS: Tarea['estado'][] = ['PENDIENTE', 'EN_PROGRESO', 'COMPLETADA'];

export const Dashboard = () => {
  const { logout } = useAuth();
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroPrioridad, setFiltroPrioridad] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState<Tarea | null>(null);
  const [error, setError] = useState('');

  const cargarTareas = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getTareas(filtroEstado || undefined, filtroPrioridad || undefined);
      setTareas(data);
    } catch {
      setError('Error al cargar las tareas');
    } finally {
      setLoading(false);
    }
  }, [filtroEstado, filtroPrioridad]);

  useEffect(() => { cargarTareas(); }, [cargarTareas]);

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
  };

  const handleCambiarEstado = async (id: number, estado: string) => {
    await cambiarEstado(id, estado);
    cargarTareas();
  };

  const handleEliminar = async (id: number) => {
    if (!confirm('¿Eliminar esta tarea?')) return;
    await eliminarTarea(id);
    cargarTareas();
  };

  const pendientes = tareas.filter(t => t.estado === 'PENDIENTE').length;
  const enProgreso = tareas.filter(t => t.estado === 'EN_PROGRESO').length;
  const completadas = tareas.filter(t => t.estado === 'COMPLETADA').length;

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">✓</div>
          <span className="logo-text">Gestor de Tareas</span>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-item active">📋 Mis tareas</div>
        </nav>
        <div className="sidebar-user">
          <button className="btn-logout" onClick={logout}>Cerrar sesión</button>
        </div>
      </aside>

      {/* Main */}
      <main className="main-content">
        <div className="topbar">
          <div>
            <h1 className="topbar-title">Dashboard</h1>
            <p className="topbar-sub">Gestioná tus tareas</p>
          </div>
          <button className="btn-primary" onClick={() => setShowForm(true)}>+ Nueva tarea</button>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card"><div className="stat-label">Total</div><div className="stat-value">{tareas.length}</div></div>
          <div className="stat-card"><div className="stat-label">Pendientes</div><div className="stat-value amber">{pendientes}</div></div>
          <div className="stat-card"><div className="stat-label">En progreso</div><div className="stat-value blue">{enProgreso}</div></div>
          <div className="stat-card"><div className="stat-label">Completadas</div><div className="stat-value green">{completadas}</div></div>
        </div>

        {/* Filtros */}
        <div className="filter-bar">
          <span className="filter-label">Filtrar:</span>
          <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
            <option value="">Todos los estados</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="EN_PROGRESO">En progreso</option>
            <option value="COMPLETADA">Completada</option>
          </select>
          <select value={filtroPrioridad} onChange={e => setFiltroPrioridad(e.target.value)}>
            <option value="">Todas las prioridades</option>
            <option value="ALTA">Alta</option>
            <option value="MEDIA">Media</option>
            <option value="BAJA">Baja</option>
          </select>
          {(filtroEstado || filtroPrioridad) && (
            <button className="btn-clear" onClick={() => { setFiltroEstado(''); setFiltroPrioridad(''); }}>Limpiar filtros</button>
          )}
        </div>

        {/* Lista de tareas */}
        {error && <div className="error-msg">{error}</div>}
        {loading ? (
          <div className="loading">Cargando tareas...</div>
        ) : tareas.length === 0 ? (
          <div className="empty-state">
            <p>No hay tareas todavía.</p>
            <button className="btn-primary" onClick={() => setShowForm(true)}>Crear primera tarea</button>
          </div>
        ) : (
          <div className="task-list">
            {tareas.map(tarea => (
              <div key={tarea.id} className={`task-card ${tarea.estado === 'COMPLETADA' ? 'done' : ''}`}>
                <div className="task-card-top">
                  <div className="task-info">
                    <h3 className="task-title">{tarea.titulo}</h3>
                    {tarea.descripcion && <p className="task-desc">{tarea.descripcion}</p>}
                    <div className="task-meta">
                      {tarea.fechaLimite && <span>📅 {tarea.fechaLimite}</span>}
                    </div>
                  </div>
                  <div className="task-badges">
                    <span className={`badge badge-prioridad ${tarea.prioridad.toLowerCase()}`}>
                      {PRIORIDAD_LABEL[tarea.prioridad]}
                    </span>
                    <span className={`badge badge-estado ${tarea.estado.toLowerCase()}`}>
                      {ESTADO_LABEL[tarea.estado]}
                    </span>
                  </div>
                </div>
                <div className="task-card-actions">
                  <select
                    value={tarea.estado}
                    onChange={e => handleCambiarEstado(tarea.id, e.target.value)}
                    className="estado-select"
                  >
                    {ESTADOS.map(e => <option key={e} value={e}>{ESTADO_LABEL[e]}</option>)}
                  </select>
                  <button className="btn-icon" onClick={() => setEditando(tarea)} title="Editar">✏️</button>
                  <button className="btn-icon danger" onClick={() => handleEliminar(tarea.id)} title="Eliminar">🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      {showForm && (
        <TareaForm titulo="Nueva tarea" onSubmit={handleCrear} onCancel={() => setShowForm(false)} />
      )}
      {editando && (
        <TareaForm titulo="Editar tarea" inicial={editando} onSubmit={handleEditar} onCancel={() => setEditando(null)} />
      )}
    </div>
  );
};
