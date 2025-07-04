// scripts/testDbConnection.js
import sequelize from '../config/db.js';

const testDatabaseConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('Unable to connect to the database:\n', error.message);
    process.exit(1);
  }
};

testDatabaseConnection();
