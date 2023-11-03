const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/connect');
const Event = require('./Event');
const User = require('./User');

const EventOptions = sequelize.define('EventOptions', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  parentEvent: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Event,
      key: 'id',
    },
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  class: {
    //Silver, Gold, Premium
    type: DataTypes.STRING,
    allowNull: false,
  },
  rate: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  maxOccupancy: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
});

module.exports = EventOptions;
