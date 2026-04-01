import express from 'express';
import {
  getStudents, getStudent, createStudent, updateStudent, deleteStudent
} from '../controllers/studentController.js';

const router = express.Router();

// VULNERABILITY 3: No authentication required on any of these routes.
// Anyone can read, create, modify or delete students without a valid token.
router.get('/', getStudents);
router.get('/:id', getStudent);
router.post('/', createStudent);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);

export default router;
