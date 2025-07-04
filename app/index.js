import app from '../server.js';
import sequelize from '../config/db.js';

await sequelize.authenticate();
await sequelize.sync({ alter: true });

export default app;
