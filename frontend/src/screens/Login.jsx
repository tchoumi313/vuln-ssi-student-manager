import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';

const API = API_URL;

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message || 'Identifiants incorrects');
      login(data.token, data.user);
      console.log('Logged in user:', data.user);
      data.user.role === 'etudiant' ? navigate('/my-grades') : navigate('/');
    } catch {
      setError('Impossible de joindre le serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">GES</div>
          <h2>Gestion des Étudiants d'une Salle</h2>
          <p>ING4-CYB · ECE Paris 2025-2026</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Nom d'utilisateur</label>
            <input
              type="text"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              placeholder="admin"
              autoComplete="username"
              required
            />
          </div>
          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>
          {error && <div className="error-msg">{error}</div>}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
        <div className="login-footer">
          <small>Catherine NGANGO · Ulrich TCHOKOUAHA · Donald TCHOUMI</small>
        </div>
      </div>
    </div>
  );
}
