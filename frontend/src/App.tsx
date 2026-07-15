import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Perfil } from './pages/Perfil';
import { Reportes } from './pages/Reportes';
import { Historial } from './pages/Historial';
import { Equipo } from './pages/Equipo';
import './App.css';

const SidebarLayout = ({ children, active }: { children: React.ReactNode; active: string }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">✓</div>
          <span className="logo-text">Gestor de Tareas</span>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section-label">General</div>
          <div className={`nav-item ${active === 'tareas' ? 'active' : ''}`} onClick={() => navigate('/')}>
            📋 Mis tareas
          </div>
          <div className={`nav-item ${active === 'equipo' ? 'active' : ''}`} onClick={() => navigate('/equipo')}>
            👥 Mi equipo
          </div>
          <div className="nav-section-label">Análisis</div>
          <div className={`nav-item ${active === 'reportes' ? 'active' : ''}`} onClick={() => navigate('/reportes')}>
            📊 Reportes
          </div>
          <div className={`nav-item ${active === 'historial' ? 'active' : ''}`} onClick={() => navigate('/historial')}>
            🕐 Historial
          </div>
        </nav>
        <div className="sidebar-bottom">
          <div className={`nav-item ${active === 'perfil' ? 'active' : ''}`} onClick={() => navigate('/perfil')}>
            👤 Mi perfil
          </div>
          <div className="plan-chip">Plan gratuito</div>
          <button className="btn-logout" onClick={logout}>Cerrar sesión</button>
        </div>
      </aside>
      <main className="main-content">{children}</main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/perfil" element={<PrivateRoute><SidebarLayout active="perfil"><Perfil /></SidebarLayout></PrivateRoute>} />
          <Route path="/reportes" element={<PrivateRoute><SidebarLayout active="reportes"><Reportes /></SidebarLayout></PrivateRoute>} />
          <Route path="/historial" element={<PrivateRoute><SidebarLayout active="historial"><Historial /></SidebarLayout></PrivateRoute>} />
          <Route path="/equipo" element={<PrivateRoute><SidebarLayout active="equipo"><Equipo /></SidebarLayout></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
