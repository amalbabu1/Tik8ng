const { Sequelize, DataTypes, Model } = require('sequelize');
const { sequelize } = require('../db/connect');
const bcrypt = require('bcrypt');

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
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      //setters
      set(value) {
        this.setDataValue('password', bcrypt.hashSync(value, 12));
      },
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    token: {
      type: DataTypes.STRING,
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
//instance methods
User.prototype.comparePassword = function (candidatePassword) {
  const ismatch = bcrypt.compareSync(candidatePassword, this.password);
  return ismatch;
};
module.exports = User;
