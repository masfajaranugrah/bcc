import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

const NODE_ENV = process.env.NODE_ENV || 'production';
const envFile = NODE_ENV === 'development' ? '.env.dev' : '.env.prod';
dotenv.config({ path: envFile });


const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,  
    },
  },
});

export default sequelize;
