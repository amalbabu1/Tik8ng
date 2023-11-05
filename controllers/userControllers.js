const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { StatusCodes } = require('http-status-codes');
const url = require('url');

const { OAuth2Client } = require('google-auth-library');

const User = require('../models/User');
const { createJWT } = require('../utils/jwt');

const keys = require('../oauth2.keys.json');

const oAuth2Client = new OAuth2Client(keys.web.client_id, keys.web.client_secret, keys.web.redirect_uris[0]);

async function verifyGoogleToken(token) {
  try {
    const ticket = await oAuth2Client.verifyIdToken({
      idToken: token,
      audience: keys.web.client_id,
    });
    return { payload: ticket.getPayload() };
  } catch (error) {
    return { error: 'Invalid user detected. Please try again' };
  }
}
const signUpController = async (req, res) => {
  //google auth
  if (req.body.credential) {
    const verificationResponse = await verifyGoogleToken(req.body.credential);

    if (verificationResponse.error) {
      return res.status(400).json({
        message: verificationResponse.error,
      });
    }
    const profile = verificationResponse?.payload;

    const db_user = await User.findOne({
      where: {
        email: profile?.email,
      },
    });
    if (db_user) res.status(StatusCodes.BAD_REQUEST).json({ msg: 'User already exists' });
    try {
      const created_user = await User.create({
        firstname: profile?.given_name,
        lastname: profile?.family_name,
        email: profile?.email,
        isAdmin: true,
      });
      const payload = { email: created_user.email, id: created_user.id, admin: created_user.isAdmin };
      const token = createJWT({ payload });
      return res.status(StatusCodes.CREATED).json({ msg: 'User Created', token, payload });
    } catch (error) {
      console.log(error);
    }
  }
  //email password auth
  else {
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
      return res.status(StatusCodes.CREATED).json({ msg: 'User Created', token, user: payload });
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
  return res.status(StatusCodes.OK).json({ msg: 'LoggedIn', token, user: payload });
};

module.exports = {
  signUpController,
  siginInController,
};
