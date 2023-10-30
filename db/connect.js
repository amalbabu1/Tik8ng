const { Sequelize } = require('sequelize');
const dotenv = require('dotenv').config();

const database = process.env.DB_NAME;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

const sequelize = new Sequelize(database, username, password, {
  host: 'localhost',
  dialect: 'postgres',
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection successfully established with Database');
  } catch (error) {
    console.error('Unable to connect to Database', error);
  }
};

module.exports = { sequelize, connectDB };
