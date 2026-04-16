import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';

const API = API_URL;

export default function MyGrades() {
  const { token, user } = useAuth();
  const [student, setStudent] = useState(null);
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    if (!user?.studentId) return;
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch(`${API}/students/${user.studentId}`, { headers }).then(r => r.json()),
      fetch(`${API}/grades/student/${user.studentId}`, { headers }).then(r => r.json())
    ]).then(([s, g]) => {
      setStudent(s);
      setGrades(Array.isArray(g) ? g : []);
    });
  }, [user, token]);

  const average = grades.length
    ? (grades.reduce((s, g) => s + g.note, 0) / grades.length).toFixed(2)
    : null;

  if (!student) return <div className="loading">Chargement de vos notes...</div>;

  return (
    <div className="student-detail">
      <div className="detail-header">
        <div className="detail-info">
          <h2>Mes Notes</h2>
          <p>{student.prenom} {student.nom} · {student.email} · {student.classe}</p>
        </div>
        <div className={`average-badge ${average !== null ? (average >= 10 ? 'pass' : 'fail') : ''}`}>
          <span>Moyenne</span>
          <strong>{average !== null ? `${average}/20` : '—'}</strong>
        </div>
      </div>

      <div className="grades-section">
        <div className="section-header">
          <h3>Résultats ({grades.length} note{grades.length > 1 ? 's' : ''})</h3>
        </div>

        {grades.length === 0 ? (
          <p className="empty-msg">Aucune note enregistrée pour le moment.</p>
        ) : (
          <table className="grades-table">
            <thead>
              <tr>
                <th>Matière</th>
                <th>Note /20</th>
                <th>Enseignant</th>
                <th>Commentaire</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {grades.map(g => (
                <tr key={g._id}>
                  <td>{g.matiere}</td>
                  <td className={g.note >= 10 ? 'note-pass' : 'note-fail'}>{g.note}</td>
                  <td>{g.enseignant || '—'}</td>
                  <td>{g.commentaire}</td>
                  <td>{new Date(g.createdAt).toLocaleDateString('fr-FR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
