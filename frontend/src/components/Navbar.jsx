import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isStudent = user?.role === 'etudiant';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span>GES</span>
        <small>Gestion des Étudiants</small>
      </div>

      <div className="navbar-links">
        {/* Staff sees Dashboard + Students list */}
        {!isStudent && (
          <>
            <Link to="/">Tableau de bord</Link>
            <Link to="/students">Étudiants</Link>
          </>
        )}
        {/* Student only sees their own grades page — NO link to /students/:id */}
        {isStudent && (
          <Link to="/my-grades">Mes Notes</Link>
        )}
      </div>

      <div className="navbar-user">
        <span className="user-badge">
          {user?.role === 'admin' ? '★ ' : ''}{user?.username}
          <small> ({user?.role})</small>
        </span>
        <button onClick={handleLogout} className="btn-logout">Déconnexion</button>
      </div>
    </nav>
  );
}
