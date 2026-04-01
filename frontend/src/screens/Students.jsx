import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API = 'http://localhost:5000/api';

const emptyForm = { nom: '', prenom: '', email: '', classe: 'ING4-CYB', numero: '' };

export default function Students() {
  const { token } = useAuth();
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const fetchStudents = () =>
    fetch(`${API}/students`, { headers }).then(r => r.json()).then(setStudents);

  useEffect(() => { fetchStudents(); }, []);

  const openAdd = () => { setForm(emptyForm); setEditId(null); setShowForm(true); };
  const openEdit = (s) => {
    setForm({ nom: s.nom, prenom: s.prenom, email: s.email || '', classe: s.classe, numero: s.numero || '' });
    setEditId(s._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editId ? `${API}/students/${editId}` : `${API}/students`;
    await fetch(url, { method: editId ? 'PUT' : 'POST', headers, body: JSON.stringify(form) });
    setShowForm(false);
    fetchStudents();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet étudiant et toutes ses notes ?')) return;
    await fetch(`${API}/students/${id}`, { method: 'DELETE', headers });
    fetchStudents();
  };

  return (
    <div className="students-page">
      <div className="page-header">
        <h2>Liste des Étudiants</h2>
        <button className="btn-primary" onClick={openAdd}>+ Ajouter un étudiant</button>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="modal">
            <h3>{editId ? 'Modifier' : 'Ajouter'} un étudiant</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Nom</label>
                  <input value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Prénom</label>
                  <input value={form.prenom} onChange={e => setForm({ ...form, prenom: e.target.value })} required />
                </div>
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Classe</label>
                  <input value={form.classe} onChange={e => setForm({ ...form, classe: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>N° Étudiant</label>
                  <input type="number" value={form.numero} onChange={e => setForm({ ...form, numero: e.target.value })} />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Annuler</button>
                <button type="submit" className="btn-primary">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-wrapper">
        <table className="students-table">
          <thead>
            <tr>
              <th>N°</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Email</th>
              <th>Classe</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 && (
              <tr><td colSpan={6} className="empty-msg">Aucun étudiant enregistré.</td></tr>
            )}
            {students.map(s => (
              <tr key={s._id}>
                <td>{s.numero || '—'}</td>
                <td>{s.nom}</td>
                <td>{s.prenom}</td>
                <td>{s.email || '—'}</td>
                <td><span className="badge">{s.classe}</span></td>
                <td className="actions">
                  <Link to={`/students/${s._id}`} className="btn-info">Notes</Link>
                  <button className="btn-warning" onClick={() => openEdit(s)}>Modifier</button>
                  <button className="btn-danger" onClick={() => handleDelete(s._id)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
