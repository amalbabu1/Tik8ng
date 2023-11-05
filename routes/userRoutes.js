const { Router } = require('express');
const { signUpController, siginInController } = require('../controllers/userControllers');

const userRouter = Router();

userRouter.post('/signup', signUpController);
userRouter.post('/signin', siginInController);

module.exports = userRouter;
