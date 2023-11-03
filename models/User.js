const { Sequelize, DataTypes, Model } = require('sequelize');
const { sequelize } = require('../db/connect');

const User = sequelize.define(
  'User',
  {
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['email'],
      },
    ],
  }
);

module.exports = User;
