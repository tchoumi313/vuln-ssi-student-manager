import Student from '../models/Student.js';

export const getStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ numero: 1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Étudiant non trouvé' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createStudent = async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!student) return res.status(404).json({ message: 'Étudiant non trouvé' });
    res.json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Étudiant supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
