import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';

const getPasswordStrength = (pwd: string): { level: number; label: string; color: string } => {
  if (pwd.length === 0) return { level: 0, label: '', color: '' };
  if (pwd.length < 6) return { level: 1, label: 'Muy débil', color: '#9b1c1c' };
  if (pwd.length < 8) return { level: 2, label: 'Débil', color: '#b45309' };
  if (pwd.length < 10 || !/[A-Z]/.test(pwd) || !/[0-9]/.test(pwd))
    return { level: 3, label: 'Buena', color: '#1a4fa0' };
  return { level: 4, label: 'Fuerte', color: '#166534' };
};

export const Register = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setLoading(true);
    try {
      const { token } = await registerApi(nombre, email, password);
      login(token);
      navigate('/');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al registrarse. El email puede ya estar en uso.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="logo-icon">✓</div>
          <span className="logo-name">Gestor de Tareas</span>
        </div>
        <h2 className="auth-title">Crear cuenta</h2>
        <p className="auth-sub">Completá tus datos para registrarte</p>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre completo</label>
            <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Tu nombre" required />
          </div>
          <div className="form-group">
            <label>Correo electrónico</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" required />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" required />
            {password.length > 0 && (
              <>
                <div className="strength-bars">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="strength-bar" style={{ background: i <= strength.level ? strength.color : 'var(--border)' }} />
                  ))}
                </div>
                <div className="strength-label" style={{ color: strength.color }}>{strength.label}</div>
              </>
            )}
          </div>
          <button type="submit" className="btn-full" disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="auth-footer">
          ¿Ya tenés cuenta? <Link to="/login">Iniciar sesión</Link>
        </p>
      </div>
    </div>
  );
};
