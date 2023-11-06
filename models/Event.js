const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../db/connect');
const User = require('./User');

const Event = sequelize.define('Event', {
  name: {
    //Movie Show
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  createdBy: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
    allowNull: false,
  },
  details: {
    type: DataTypes.STRING,
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

module.exports = Event;
