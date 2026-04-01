import express from 'express';
import {
  getAllGrades, getGradesByStudent, createGrade, updateGrade, deleteGrade
} from '../controllers/gradeController.js';

const router = express.Router();

// VULNERABILITY 3: No authentication required on any of these routes.
router.get('/', getAllGrades);
router.get('/student/:studentId', getGradesByStudent);
router.post('/', createGrade);
router.put('/:id', updateGrade);
router.delete('/:id', deleteGrade);

export default router;
