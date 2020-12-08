const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('./routes/index.js');

const { PORT = 3000 } = process.env;
const app = express();

const mongoDBUrl = 'mongodb://localhost:27017/newsdb';
const mongoDBOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', router);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

mongoose.connect(mongoDBUrl, mongoDBOptions);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const { message } = err;
  console.log(message);
  res.status(statusCode).send({ message });
  next();
});

app.listen(PORT, () => console.log('SERVER IS RUNNING'));
