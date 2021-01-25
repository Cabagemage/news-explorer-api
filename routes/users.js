const userRouter = require('express').Router();

const {
  getOwnerInfo,
} = require('../controllers/users');

userRouter.get('/me', getOwnerInfo);

module.exports = userRouter;
