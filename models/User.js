import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../config/db.js';

const User = sequelize.define('User', {
    access_token: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    refresh_token: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: { isEmail: true }
    },
    password_hash: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'user'
    },
    paket_id: {
        type: DataTypes.UUID,
        allowNull: true
    },

    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    last_login: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'users',
    timestamps: false
});

export default User;
