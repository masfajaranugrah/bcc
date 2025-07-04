import express from 'express';
import { login, refreshAccessToken, register } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshAccessToken);

export default router;
