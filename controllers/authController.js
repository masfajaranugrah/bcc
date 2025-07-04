import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { v4 as uuidv4 } from "uuid";

const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret_key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'jwt_refresh_secret';

export const register = async (req, res) => {
  const { name, email, password, role, paket_id } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({
      message: "All fields (name, email, password, role) are required."
    });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const parsedPaketId =
      paket_id && typeof paket_id === "string" && paket_id !== "{}"
        ? paket_id
        : null;

    // Generate tokens
    const accessToken = jwt.sign({ email, role }, JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ email }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

    const newUser = await User.create({
      id: uuidv4(),
      name,
      email,
      password_hash,
      role,
      paket_id: parsedPaketId,
      access_token: accessToken,
      refresh_token: refreshToken,
      created_at: new Date()
    });

    // Set token to HTTP-only cookie
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false, // Set true jika pakai HTTPS
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000 // 15 menit
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 hari
    });

    return res.status(201).json({
      message: "User registered successfully.",
      data: newUser
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

 
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required.' });

  try {
    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(401).json({ message: 'Invalid email or password.' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match)
      return res.status(401).json({ message: 'Invalid email or password.' });

    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '5s' }
    );
    const refreshToken = jwt.sign(
      { userId: user.id },
      JWT_REFRESH_SECRET,
      { expiresIn: '1d' }
    );

    await user.update({ access_token: accessToken, refresh_token: refreshToken });

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
const { password_hash, access_token, refresh_token, ...safeUser } = user.toJSON();

    return res.status(200).json({
  message: 'Login successful.',
  data: safeUser, accessToken
});
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
}

export const refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: "Refresh token not found." });

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

    const user = await User.findOne({ where: { id: decoded.userId } });
    if (!user || user.refresh_token !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token." });
    }

    // Generate access token baru
    const newAccessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '5s' } // bisa ubah lebih panjang nanti
    );

    await user.update({ access_token: newAccessToken });

    // Set cookie baru
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 5 * 1000
    });

    return res.status(200).json({ accessToken: newAccessToken });

  } catch (err) {
    return res.status(403).json({ message: "Refresh token expired or invalid.", error: err.message });
  }
};