import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// VULNERABILITY 1: NoSQL Injection
// req.body.username and req.body.password are passed directly into the query.
// Attack: send JSON {"username": "admin", "password": {"$gt": ""}}
// MongoDB evaluates {"$gt": ""} as true for any non-empty password → auth bypass.
export const login = async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.body.username,
      password: req.body.password
    });

    if (!user) return res.status(401).json({ message: 'Identifiants incorrects' });

    const payload = { id: user._id, username: user.username, role: user.role, studentId: user.studentId || null };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret123', { expiresIn: '24h' });

    res.json({ token, user: payload });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const register = async (req, res) => {
  try {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
      role: req.body.role || 'enseignant'
    });
    await user.save();
    res.status(201).json({ message: 'Utilisateur créé avec succès' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getMe = async (req, res) => {
  res.json({ user: req.user });
};
