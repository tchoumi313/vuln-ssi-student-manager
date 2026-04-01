import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const API = 'http://localhost:5000/api';

export default function MyGrades() {
  const { token, user } = useAuth();
  const [student, setStudent] = useState(null);
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    if (!user?.studentId) return;
    const headers = { Authorization: `Bearer ${token}` };

    // VULNERABILITY 4: IDOR — Insecure Direct Object Reference
    // The backend route GET /api/grades/student/:studentId does NOT verify
    // that the authenticated user owns that studentId.
    // This page calls it with user.studentId from the JWT — looks legitimate.
    // But a student can open DevTools, grab another student's _id from
    // GET /api/students (open route, no auth needed), then navigate directly to:
    //   http://localhost:5173/students/<other_student_id>
    // The StudentDetail page will load and show the victim's full grade sheet.
    // No button or link points to that page in the student's UI — it's "hidden" —
    // but direct URL access bypasses the frontend navigation entirely.
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
                {/*
                  VULNERABILITY 2 (visible here too):
                  commentaire is rendered with dangerouslySetInnerHTML.
                  A malicious teacher (or anyone with API access) can inject
                  a stored XSS payload that fires when the student views their notes.
                */}
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
                  <td dangerouslySetInnerHTML={{ __html: g.commentaire }} />
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
