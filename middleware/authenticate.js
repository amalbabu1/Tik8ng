const { StatusCodes } = require('http-status-codes');
const { isTokenValid } = require('../utils/jwt');

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ msg: 'Authentication invalid' });
  }
  try {
    const token = authHeader.split(' ')[1];
    const { email, id, admin } = isTokenValid({ token });
    req.user = { email, id, admin };
  } catch (err) {
    console.log(err);
    return res.status(StatusCodes.UNAUTHORIZED).json({ msg: 'Authentication invalid' });
  }
  next();
};

const authorizePermission = (...roles) => {
  return function (req, res, next) {
    if (!req.user.admin === true && roles.includes('admin')) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: 'Unauthorizes access to this route' });
    }
    next();
  };
};
module.exports = {
  authenticateUser,
  authorizePermission,
};
