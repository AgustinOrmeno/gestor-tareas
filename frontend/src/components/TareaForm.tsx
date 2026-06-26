import { useState, FormEvent } from 'react';
import type { Tarea, TareaRequest } from '../types';

interface Props {
  inicial?: Tarea;
  onSubmit: (data: TareaRequest) => Promise<void>;
  onCancel: () => void;
  titulo: string;
}

export const TareaForm = ({ inicial, onSubmit, onCancel, titulo }: Props) => {
  const [tituloVal, setTituloVal] = useState(inicial?.titulo || '');
  const [descripcion, setDescripcion] = useState(inicial?.descripcion || '');
  const [prioridad, setPrioridad] = useState<'BAJA' | 'MEDIA' | 'ALTA'>(inicial?.prioridad || 'MEDIA');
  const [fechaLimite, setFechaLimite] = useState(inicial?.fechaLimite?.slice(0, 10) || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSubmit({ titulo: tituloVal, descripcion, prioridad, fechaLimite: fechaLimite || null });
    } catch {
      setError('Error al guardar la tarea');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-top">
          <span className="modal-title">{titulo}</span>
          <button className="modal-close" onClick={onCancel}>✕</button>
        </div>
        {error && <div className="error-msg" style={{ margin: '0 18px' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Título *</label>
              <input type="text" value={tituloVal} onChange={e => setTituloVal(e.target.value)} placeholder="Título de la tarea" required />
            </div>
            <div className="form-group">
              <label>Descripción</label>
              <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Descripción opcional..." rows={3} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Prioridad</label>
                <select value={prioridad} onChange={e => setPrioridad(e.target.value as any)}>
                  <option value="ALTA">Alta</option>
                  <option value="MEDIA">Media</option>
                  <option value="BAJA">Baja</option>
                </select>
              </div>
              <div className="form-group">
                <label>Fecha límite</label>
                <input type="date" value={fechaLimite} min={new Date().toISOString().split('T')[0]} onChange={e => setFechaLimite(e.target.value)} />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onCancel}>Cancelar</button>
            <button type="submit" className="btn-confirm" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
