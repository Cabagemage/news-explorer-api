const isEmail = require('validator/lib/isEmail');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const NotFound = require('../utils/Errors/NotFound');
const ConflictError = require('../utils/Errors/ConflictError');

const { Schema } = mongoose;

const User = new Schema({
  name: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив-Кусто',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

User.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new NotFound('Пользователь не найден'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new ConflictError('Неправильные почта или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('User', User);
