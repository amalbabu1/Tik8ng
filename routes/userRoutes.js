const { Router } = require('express');
const { signUpController, siginInController } = require('../controllers/userControllers');

const userRouter = Router();

userRouter.post('/signin', signUpController);
userRouter.post('/siginin1', siginInController);

module.exports = userRouter;
