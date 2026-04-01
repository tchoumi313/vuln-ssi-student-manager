import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String },
  classe: { type: String, required: true },
  numero: { type: Number }
}, { timestamps: true });

export default mongoose.model('Student', studentSchema);
