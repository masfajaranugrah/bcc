import {Sequelize} from 'sequelize';
import dotenv from 'dotenv';
const envFile = process.env.NODE_ENV === 'development' ? '.env.dev' : '.env.prod';

dotenv.config({path: envFile})
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    
    {
  host:  process.env.DB_HOST,
  dialect: 'postgres',
  logging: false
});

 export default sequelize;