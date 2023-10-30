const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../db/connect');
const User = require('./User');

const Event = sequelize.define('Event', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdBy: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
  },
  details: {
    type: DataTypes.STRING,
  },
});

module.exports = Event;
