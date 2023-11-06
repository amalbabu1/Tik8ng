const dotenv = require('dotenv');
const morgan = require('morgan');
const express = require('express');
const cors = require('cors');

const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const { connectDB } = require('./db/connect');
const UserModel = require('./models/User');
const EventModel = require('./models/Event');
const EventOptionsModel = require('./models/EventOptions');
const initModel = require('./utils/db_utils');

const userRoutes = require('./routes/userRoutes');
const eventRouter = require('./routes/eventRoutes');
const { StatusCodes } = require('http-status-codes');

dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status == 400 && 'body' in err) {
    console.log(err.message);
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: err.message });
  }
  next();
});

app.get('/', (req, res) => {
  res.send('Welcome to the ticketing app');
});

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/event', eventRouter);

const PORT = process.env.PORT || 3000;

const start = async () => {
  await connectDB();
  await UserModel.sync({ sync: true });
  await EventModel.sync({ alter: true });
  await EventOptionsModel.sync();
  // initModel();

  try {
    app.listen(PORT, () => {
      console.log(`Server is listening at port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
