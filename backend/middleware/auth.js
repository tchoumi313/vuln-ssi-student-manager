import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Accès non autorisé - token manquant' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
    next();
  } catch {
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};
