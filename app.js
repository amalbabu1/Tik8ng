const dotenv = require('dotenv');
const morgan = require('morgan');

const { connectDB } = require('./db/connect');
const UserModel = require('./models/User');
const EventModel = require('./models/Event');

dotenv.config();

const start = async () => {
  await connectDB();
  UserModel.sync();
  EventModel.sync();
};

start();
