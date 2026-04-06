import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';

const API = API_URL;

const emptyForm = { matiere: '', note: '', commentaire: '', enseignant: '' };

export default function StudentDetail() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const [student, setStudent] = useState(null);
  const [grades, setGrades] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const fetchData = async () => {
    const [s, g] = await Promise.all([
      fetch(`${API}/students/${id}`, { headers }).then(r => r.json()),
      fetch(`${API}/grades/student/${id}`, { headers }).then(r => r.json())
    ]);
    setStudent(s);
    setGrades(Array.isArray(g) ? g : []);
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`${API}/grades`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        ...form,
        studentId: id,
        note: Number(form.note),
        enseignant: form.enseignant || user?.username
      })
    });
    setForm(emptyForm);
    setShowForm(false);
    fetchData();
  };

  const handleDelete = async (gradeId) => {
    if (!window.confirm('Supprimer cette note ?')) return;
    await fetch(`${API}/grades/${gradeId}`, { method: 'DELETE', headers });
    fetchData();
  };

  const average = grades.length
    ? (grades.reduce((s, g) => s + g.note, 0) / grades.length).toFixed(2)
    : null;

  if (!student) return <div className="loading">Chargement...</div>;

  return (
    <div className="student-detail">
      <div className="detail-header">
        <Link to="/students" className="btn-back">← Retour</Link>
        <div className="detail-info">
          <h2>{student.prenom} {student.nom}</h2>
          <p>{student.email || 'Pas d\'email'} · {student.classe} · N°{student.numero || '—'}</p>
        </div>
        <div className={`average-badge ${average !== null ? (average >= 10 ? 'pass' : 'fail') : ''}`}>
          <span>Moyenne</span>
          <strong>{average !== null ? `${average}/20` : '—'}</strong>
        </div>
      </div>

      <div className="grades-section">
        <div className="section-header">
          <h3>Notes ({grades.length})</h3>
          <button className="btn-primary" onClick={() => setShowForm(true)}>+ Ajouter une note</button>
        </div>

        {showForm && (
          <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
            <div className="modal">
              <h3>Ajouter une note</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Matière</label>
                    <input value={form.matiere} onChange={e => setForm({ ...form, matiere: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Note /20</label>
                    <input
                      type="number" min="0" max="20" step="0.5"
                      value={form.note}
                      onChange={e => setForm({ ...form, note: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Enseignant</label>
                  <input value={form.enseignant} onChange={e => setForm({ ...form, enseignant: e.target.value })} placeholder={user?.username} />
                </div>
                <div className="form-group">
                  <label>Commentaire</label>
                  <textarea
                    value={form.commentaire}
                    onChange={e => setForm({ ...form, commentaire: e.target.value })}
                    rows={3}
                    placeholder="Observations sur la performance..."
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Annuler</button>
                  <button type="submit" className="btn-primary">Enregistrer</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {grades.length === 0 ? (
          <p className="empty-msg">Aucune note pour cet étudiant.</p>
        ) : (
          <table className="grades-table">
            <thead>
              <tr>
                <th>Matière</th>
                <th>Note /20</th>
                <th>Enseignant</th>
                <th>Commentaire</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {grades.map(g => (
                <tr key={g._id}>
                  <td>{g.matiere}</td>
                  <td className={g.note >= 10 ? 'note-pass' : 'note-fail'}>{g.note}</td>
                  <td>{g.enseignant || '—'}</td>
                  {/*
                    VULNERABILITY 2: Stored XSS
                    commentaire is rendered as raw HTML — no sanitization anywhere.
                    Red team exploit:
                      POST /api/grades  { commentaire: "<img src=x onerror=alert(document.cookie)>" }
                    Every user who views this student's grades will execute the payload.
                  */}
                  <td dangerouslySetInnerHTML={{ __html: g.commentaire }} />
                  <td>{new Date(g.createdAt).toLocaleDateString('fr-FR')}</td>
                  <td>
                    <button className="btn-danger" onClick={() => handleDelete(g._id)}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
