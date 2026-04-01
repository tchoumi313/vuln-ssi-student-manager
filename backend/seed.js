import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';
import Student from './models/Student.js';
import Grade from './models/Grade.js';

await mongoose.connect(process.env.MONGODB_URI);
console.log('Connected to MongoDB');

await User.deleteMany({});
await Student.deleteMany({});
await Grade.deleteMany({});

// ── Students ─────────────────────────────────────────────
const students = await Student.insertMany([
  { nom: 'NGANGO KOLOKO',       prenom: 'Catherine',       email: 'catherine.ngango@ece.fr',  classe: 'ING4-CYB', numero: 1 },
  { nom: 'TCHOKOUAHA TCHOUAMO', prenom: 'Ulrich',          email: 'ulrich.tchokouaha@ece.fr', classe: 'ING4-CYB', numero: 2 },
  { nom: 'TCHOUMI NZIKEU',      prenom: 'Beaudouin Donald',email: 'donald.tchoumi@ece.fr',    classe: 'ING4-CYB', numero: 3 },
  { nom: 'MARTIN',              prenom: 'Sophie',          email: 'sophie.martin@ece.fr',     classe: 'ING4-CYB', numero: 4 },
  { nom: 'BERNARD',             prenom: 'Lucas',           email: 'lucas.bernard@ece.fr',     classe: 'ING4-CYB', numero: 5 },
]);
console.log('Students seeded:', students.length);

// ── Users (admin + enseignant + etudiants) ────────────────
await User.insertMany([
  { username: 'admin',       password: 'admin123',    role: 'admin' },
  { username: 'prof.dupont', password: 'dupont2024',  role: 'enseignant' },
  // Student accounts — each linked to a Student document via studentId
  { username: 'catherine',  password: 'cath2024',    role: 'etudiant', studentId: students[0]._id },
  { username: 'ulrich',     password: 'ulrich2024',  role: 'etudiant', studentId: students[1]._id },
  { username: 'donald',     password: 'donald2024',  role: 'etudiant', studentId: students[2]._id },
]);
console.log('Users seeded');

// ── Grades ────────────────────────────────────────────────
await Grade.insertMany([
  { studentId: students[0]._id, matiere: 'Sécurité des SI',  note: 16, commentaire: 'Excellent travail',      enseignant: 'prof.dupont' },
  { studentId: students[0]._id, matiere: 'Cryptographie',    note: 14, commentaire: 'Bon niveau',             enseignant: 'prof.dupont' },
  { studentId: students[1]._id, matiere: 'Sécurité des SI',  note: 15, commentaire: 'Très bien',              enseignant: 'prof.dupont' },
  { studentId: students[1]._id, matiere: 'Réseaux',          note: 12, commentaire: 'Peut mieux faire',       enseignant: 'prof.dupont' },
  { studentId: students[2]._id, matiere: 'Sécurité des SI',  note: 18, commentaire: 'Remarquable',            enseignant: 'prof.dupont' },
  { studentId: students[2]._id, matiere: 'Réseaux',          note: 17, commentaire: 'Très bonne maîtrise',    enseignant: 'prof.dupont' },
  { studentId: students[3]._id, matiere: 'Sécurité des SI',  note: 19,  commentaire: 'Honorable',      enseignant: 'prof.dupont' },
  { studentId: students[4]._id, matiere: 'Cryptographie',    note: 11, commentaire: 'Résultats corrects',     enseignant: 'prof.dupont' },
]);
console.log('Grades seeded');

await mongoose.disconnect();
console.log('\nSeed terminé.');
console.log('Comptes disponibles:');
console.log('  admin       / admin123');
console.log('  prof.dupont / dupont2024');
console.log('  catherine   / cath2024   (étudiant)');
console.log('  ulrich      / ulrich2024 (étudiant)');
console.log('  donald      / donald2024 (étudiant)');
process.exit(0);
