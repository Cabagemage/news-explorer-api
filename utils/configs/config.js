const JWT_SECRET = 'EAT_THIS_FISH';
const mongoDBUrl = 'mongodb://localhost:27017/newsdb';
const mongoDBOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

module.exports = {
  JWT_SECRET,
  mongoDBUrl,
  mongoDBOptions,
};
