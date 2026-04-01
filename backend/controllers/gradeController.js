import Grade from '../models/Grade.js';

export const getAllGrades = async (req, res) => {
  try {
    const grades = await Grade.find().populate('studentId', 'nom prenom classe');
    res.json(grades);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getGradesByStudent = async (req, res) => {
  try {
    const grades = await Grade.find({ studentId: req.params.studentId }).sort({ createdAt: -1 });
    res.json(grades);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// VULNERABILITY 2: Stored XSS
// The commentaire field is saved as-is without sanitization.
// The frontend renders it with dangerouslySetInnerHTML.
// Attack: POST /api/grades with commentaire: "<img src=x onerror=alert('XSS')>"
export const createGrade = async (req, res) => {
  try {
    const grade = new Grade({
      studentId: req.body.studentId,
      matiere: req.body.matiere,
      note: req.body.note,
      commentaire: req.body.commentaire,
      enseignant: req.body.enseignant
    });
    await grade.save();
    res.status(201).json(grade);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateGrade = async (req, res) => {
  try {
    const grade = await Grade.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!grade) return res.status(404).json({ message: 'Note non trouvée' });
    res.json(grade);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteGrade = async (req, res) => {
  try {
    await Grade.findByIdAndDelete(req.params.id);
    res.json({ message: 'Note supprimée' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
