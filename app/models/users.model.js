import { db_end, db_start } from "../config/config";

export default (sequelize, Sequelize) => {

    const users = sequelize.define("user", {
        id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        unique_id: {
            type: Sequelize.STRING(40),
            allowNull: false,
            unique: true
        },
        method: {
            type: Sequelize.STRING(50),
            allowNull: false,
        },
        firstname: {
            type: Sequelize.STRING(50),
            allowNull: false,
        },
        middlename: {
            type: Sequelize.STRING(50),
            allowNull: true,
        },
        lastname: {
            type: Sequelize.STRING(50),
            allowNull: false,
        },
        email: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        email_verification: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        phone_number: {
            type: Sequelize.STRING(20),
            allowNull: false
        },
        phone_number_verification: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        alt_phone_number: {
            type: Sequelize.STRING(20),
            allowNull: true,
        },
        gender: {
            type: Sequelize.STRING(20),
            allowNull: false,
        },
        date_of_birth: {
            type: Sequelize.DATEONLY,
            allowNull: false,
        },
        address: {
            type: Sequelize.STRING(300),
            allowNull: true,
        },
        country: {
            type: Sequelize.STRING(50),
            allowNull: true,
        },
        state: {
            type: Sequelize.STRING(50),
            allowNull: true,
        },
        city: {
            type: Sequelize.STRING(50),
            allowNull: true,
        },
        balance: {
            type: Sequelize.FLOAT,
            allowNull: false,
        },
        privates: {
            type: Sequelize.STRING(255),
            allowNull: false,
        },
        profile_image: {
            type: Sequelize.STRING(500),
            allowNull: true,
        },
        profile_image_public_id: {
            type: Sequelize.STRING(500),
            allowNull: true,
        },
        access: {
            type: Sequelize.INTEGER(1),
            allowNull: false,
        },
        status: {
            type: Sequelize.INTEGER(1),
            allowNull: false,
        }
    }, {
        tableName: `${db_start}users${db_end}`
    });
    return users;
};