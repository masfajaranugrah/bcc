import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret_key';

export const authenticate = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token)
    return res.status(401).json({ message: 'Access token missing.' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};
