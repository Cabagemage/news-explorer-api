const Article = require('../models/article');
const NotFound = require('../utils/Errors/NotFound');
const BadRequest = require('../utils/Errors/BadRequest');
const ForbiddenError = require('../utils/Errors/ForbiddenError');

module.exports.getArticles = (req, res, next) => {
  Article.find({})
    .orFail(() => {
      throw new NotFound('Статьи не найдены');
    })
    .then((articles) => {
      res.send({ date: articles });
    }).catch(next);
};

module.exports.createArticle = (req, res, next) => {
  const owner = req.user.id;

  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  Article.create({
    keyword, title, text, date, source, link, image, owner,
  })
    .then((article) => res.status(200).send(article))
    .catch((err) => {
      if (err && !title && !link) {
        const error = new BadRequest('С названием и ссылкой на изображение что-то не так');
        next(error);
      } else if (err && !title) {
        const error = new BadRequest('Введите название');
        next(error);
      } else if (err && !link) {
        const error = new BadRequest('С ссылкой на статью что-то не так');
        next(error);
      }
    });
};

module.exports.deleteArticle = (req, res, next) => {
  const userId = req.user.id;
  const { _articleId } = req.params;
  Article.findById(_articleId)
    .populate('owner')
    .then((article) => {
      if (article.owner.id === userId) {
        Article.findByIdAndDelete(_articleId)
          .then((thisArticle) => {
            res.status(200).send(thisArticle);
          });
      } else {
        const err = new ForbiddenError('Запрещено удалять новости других пользователей');
        next(err);
      }
    })
    .catch((err) => {
      if (err) {
        const error = new NotFound('Карточка уже удалена');
        next(error);
      }
    });
};
