const dotenv = require('dotenv');
const morgan = require('morgan');

const { connectDB } = require('./db/connect');
const UserModel = require('./models/User');

dotenv.config();

const start = async () => {
  await connectDB();
  UserModel.sync();
};

start();
