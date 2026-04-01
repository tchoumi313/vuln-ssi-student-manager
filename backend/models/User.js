import mongoose from 'mongoose';

// VULNERABILITY: passwords stored in plain text (no hashing)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'enseignant', 'etudiant'], default: 'enseignant' },
  // For role=etudiant: links the auth user to a Student document
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', default: null }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
