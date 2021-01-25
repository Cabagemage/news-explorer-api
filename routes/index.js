const express = require('express');

const app = express();
const router = require('express').Router();
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('../middlewares/logger');
const NotFound = require('../utils/Errors/NotFound');
const userRouter = require('./users.js');
const articlesRouter = require('./articles.js');

app.use(requestLogger);
router.use('/users', userRouter);
router.use('/articles', articlesRouter);

router.use('*', (req, res, next) => {
  const error = new NotFound('Страницы не существует');
  res.send(error);
  next(error);
});
router.use(errors());
app.use(errorLogger);

module.exports = router;
