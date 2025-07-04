import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
// Load env
const envFile = process.env.NODE_ENV === 'development' ? '.env.dev' : '.env.prod';
dotenv.config({ path: envFile });

// Init express
const app = express();
app.use(cookieParser());

// DB
import sequelize from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import protectedRoutes from './routes/protectedRoutes.js';

// Middleware
app.use(express.json());

// Setup CORS
const whitelist = ['http://localhost:3000', 'http://example2.com', undefined];
const corsOptions = function (req, callback) {
  const origin = req.header('Origin');
  if (!origin || whitelist.includes(origin)) {
    callback(null, { origin: true });
  } else {
    callback(null, { origin: false });
  }
};
app.use(cors(corsOptions));

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);  
app.use('/api/v1/protected', protectedRoutes);
// Start App
const startServer = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });  

    const PORT = process.env.PORT_SRV || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    process.exit(1);
  }
};

startServer();
