const dotenv = require('dotenv');
const morgan = require('morgan');

const { connectDB } = require('./db/connect');
const UserModel = require('./models/User');
const EventModel = require('./models/Event');
const EventOptionsModel = require('./models/EventOptions');
const initModel = require('./utils/db_utils');

dotenv.config();

const start = async () => {
  await connectDB();
  await UserModel.sync();
  await EventModel.sync();
  await EventOptionsModel.sync({ alter: true });
  initModel();
};

start();
