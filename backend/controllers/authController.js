import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// FIX 4: NoSQL injection prevention — force string coercion before querying MongoDB.
// Passing an object like {"$gt":""} as req.body.password would previously reach
// findOne() as a MongoDB operator. toString() ensures it is always a plain string.
export const login = async (req, res) => {
  try {
    const username = String(req.body.username || '').trim();
    const password = String(req.body.password || '');

    if (!username || !password) {
      return res.status(400).json({ message: 'Identifiants requis' });
    }

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'Identifiants incorrects' });

    // FIX 5: bcrypt comparison — passwords are now hashed, no plain-text comparison
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Identifiants incorrects' });

    const payload = { id: user._id, username: user.username, role: user.role, studentId: user.studentId || null };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret123', { expiresIn: '24h' });

    res.json({ token, user: payload });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const register = async (req, res) => {
  try {
    const hash = await bcrypt.hash(String(req.body.password), 12);
    const user = new User({
      username: String(req.body.username).trim(),
      password: hash,
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
