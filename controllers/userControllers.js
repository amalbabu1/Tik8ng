const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { StatusCodes } = require('http-status-codes');

const User = require('../models/User');
const { createJWT } = require('../utils/jwt');

const signUpController = async (req, res) => {
  console.log('SiginUp');
  //if user sigin with google auth
  if (req.headers.authorization) {
    const g_user = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: req.headers.authorization,
      },
    });
    const { given_name, family_name, email } = g_user.data;
    const db_user = await User.findOne({
      where: {
        email: email,
      },
    });
    if (db_user) {
      return res.status(400).json({ message: 'User already exist!' });
    } else {
      try {
        const created_user = await User.create({
          firstname: given_name,
          lastname: family_name,
          email: email,
          isAdmin: true,
          token: req.headers.authorization,
        });
        const payload = {
          email: created_user.email,
          id: created_user.id,
          admin: created_user.isAdmin,
        };

        const token = createJWT({ payload });
        return res.status(200).json({ msg: 'User created', token });
      } catch (error) {
        return res.json({ message: error.msg });
      }
    }
  } else {
    const { email, password, confirmpassword, firstname, lastname } = req.body;
    if (!email || !password || !confirmpassword || !firstname || !lastname)
      return res.status(400).json({ message: 'Invalid field' });

    if (password !== confirmpassword) return res.status(400).json({ message: 'Password doesnot match' });

    const db_user = await User.findOne({
      where: {
        email: email,
      },
    });
    if (db_user) {
      return res.status(400).json({ message: 'User already exist' });
    } else {
      const created_user = await User.create({
        firstname,
        lastname,
        email,
        password,
        isAdmin: true,
      });
      const payload = {
        email: created_user.email,
        id: created_user.id,
        admin: created_user.isAdmin,
      };
      const token = createJWT({ payload });
      return res.status(StatusCodes.CREATED).json({ msg: 'User Created', token });
    }
  }
};

const siginInController = async (req, res) => {
  const { email, password } = req.body;
  const db_user = await User.findOne({
    where: {
      email: email,
    },
  });
  console.log(db_user);
  if (!db_user) return res.status(StatusCodes.NOT_FOUND).json({ msg: 'Please enter a valid email' });
  if (!db_user.comparePassword(password)) return res.status(StatusCodes.UNAUTHORIZED).json({ msg: 'Invalid password' });

  const payload = {
    email: db_user.email,
    id: db_user.id,
    admin: db_user.isAdmin,
  };
  const token = createJWT({ payload });
  return res.status(StatusCodes.OK).json({ msg: 'LoggedIn', token });
};

module.exports = {
  signUpController,
  siginInController,
};
