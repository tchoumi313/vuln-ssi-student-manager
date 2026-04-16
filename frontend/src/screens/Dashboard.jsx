import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';

const API = API_URL;

export default function Dashboard() {
  const { token, user } = useAuth();
  const [stats, setStats] = useState({ students: 0, grades: 0, average: '-' });
  const [recentGrades, setRecentGrades] = useState([]);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch(`${API}/students`, { headers }).then(r => r.json()),
      fetch(`${API}/grades`, { headers }).then(r => r.json())
    ]).then(([students, grades]) => {
      const avg = grades.length
        ? (grades.reduce((s, g) => s + g.note, 0) / grades.length).toFixed(2)
        : '-';
      setStats({ students: students.length, grades: grades.length, average: avg });
      setRecentGrades(grades.slice(0, 5));
    }).catch(() => {});
  }, [token]);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Tableau de bord</h2>
        <p>Bienvenue, <strong>{user?.username}</strong></p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-value">{stats.students}</span>
          <span className="stat-label">Étudiants</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.grades}</span>
          <span className="stat-label">Notes enregistrées</span>
        </div>
        <div className="stat-card highlight">
          <span className="stat-value">{stats.average}</span>
          <span className="stat-label">Moyenne générale /20</span>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h3>Dernières notes</h3>
          <Link to="/students" className="btn-primary">Voir tous les étudiants</Link>
        </div>
        {recentGrades.length > 0 ? (
          <table className="grades-table">
            <thead>
              <tr>
                <th>Étudiant</th>
                <th>Matière</th>
                <th>Note /20</th>
                <th>Enseignant</th>
              </tr>
            </thead>
            <tbody>
              {recentGrades.map(g => (
                <tr key={g._id}>
                  <td>
                    {g.studentId
                      ? `${g.studentId.prenom} ${g.studentId.nom}`
                      : '—'}
                  </td>
                  <td>{g.matiere}</td>
                  <td className={g.note >= 10 ? 'note-pass' : 'note-fail'}>{g.note}</td>
                  <td>{g.enseignant || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="empty-msg">Aucune note enregistrée.</p>
        )}
      </div>
    </div>
  );
}
