import Grade from '../models/Grade.js';

export const getAllGrades = async (req, res) => {
  try {
    // Only admin and enseignant may list all grades
    if (req.user.role === 'etudiant') {
      return res.status(403).json({ message: 'Accès refusé' });
    }
    const grades = await Grade.find().populate('studentId', 'nom prenom classe');
    res.json(grades);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// FIX 6: IDOR — ownership check — addresses Red Team finding #4
// Previously any authenticated user could fetch any student's grades by changing the
// studentId parameter. Now etudiant users can only access their own grades.
export const getGradesByStudent = async (req, res) => {
  try {
    if (req.user.role === 'etudiant' &&
        req.user.studentId?.toString() !== req.params.studentId) {
      return res.status(403).json({ message: 'Accès refusé : vous ne pouvez consulter que vos propres notes.' });
    }
    const grades = await Grade.find({ studentId: req.params.studentId }).sort({ createdAt: -1 });
    res.json(grades);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createGrade = async (req, res) => {
  try {
    if (req.user.role === 'etudiant') {
      return res.status(403).json({ message: 'Accès refusé' });
    }
    // FIX 7: XSS — strip all HTML tags from commentaire before persisting
    const sanitize = (str) => String(str || '').replace(/<[^>]*>/g, '').trim();
    const grade = new Grade({
      studentId: req.body.studentId,
      matiere: sanitize(req.body.matiere),
      note: req.body.note,
      commentaire: sanitize(req.body.commentaire),
      enseignant: sanitize(req.body.enseignant)
    });
    await grade.save();
    res.status(201).json(grade);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateGrade = async (req, res) => {
  try {
    if (req.user.role === 'etudiant') {
      return res.status(403).json({ message: 'Accès refusé' });
    }
    const sanitize = (str) => String(str || '').replace(/<[^>]*>/g, '').trim();
    const update = {
      ...req.body,
      commentaire: sanitize(req.body.commentaire),
      matiere: sanitize(req.body.matiere),
      enseignant: sanitize(req.body.enseignant)
    };
    const grade = await Grade.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!grade) return res.status(404).json({ message: 'Note non trouvée' });
    res.json(grade);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteGrade = async (req, res) => {
  try {
    if (req.user.role === 'etudiant') {
      return res.status(403).json({ message: 'Accès refusé' });
    }
    await Grade.findByIdAndDelete(req.params.id);
    res.json({ message: 'Note supprimée' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
