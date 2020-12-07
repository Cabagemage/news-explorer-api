require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequest = require('../utils/Errors/BadRequest');
const ConflictError = require('../utils/Errors/ConflictError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) { const error = new ConflictError('Такой пользователь уже существует'); next(error); } else if (password.length === 0 || !password.trim()) {
        const error = new BadRequest('Пароль состоит только из пробелов. Это плохо.'); next(error);
      }
    });
  bcrypt.hash(password, 10).then((hash) => User.create({
    email: req.body.email,
    password: hash,
    name: req.body.name,
    about: req.body.about,
    avatar: req.body.avatar,
  }).then((user) => {
    res.status(200).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    });
  })).catch((err) => {
    if (err && !email) { const error = new BadRequest('Некорректно введена почта'); next(error); }
  });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      return res.send({ token });
    }).catch((err) => {
      next(err);
    });
};
