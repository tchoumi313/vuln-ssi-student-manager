import mongoose from 'mongoose';

const gradeSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  matiere: { type: String, required: true },
  note: { type: Number, required: true, min: 0, max: 20 },
  // VULNERABILITY: commentaire field is stored and served without sanitization → Stored XSS
  commentaire: { type: String, default: '' },
  enseignant: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Grade', gradeSchema);
