const articleSchema = require('../models/article');
const NotFound = require('../utils/Errors/NotFound');
const BadRequest = require('../utils/Errors/BadRequest');
const ForbiddenError = require('../utils/Errors/ForbiddenError');

module.exports.getCards = (req, res, next) => {
  articleSchema.find({})
    .orFail(() => {
      throw new NotFound({ message: 'Статьи не найдены' });
    })
    .then((articles) => {
      res.send(articles);
      // ubral {data: articles}
    }).catch(next);
};

module.exports.createCard = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  const owner = req.user.id;
  articleSchema.create({
    keyword, title, text, date, source, link, image, owner,
  })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err && !title && !link) {
        const error = new BadRequest('С названием и ссылкой на изображение что-то не так');
        next(error);
      } else if (err && !title) {
        const error = new BadRequest('Введите название карточки');
        next(error);
      } else if (err && !link) {
        const error = new BadRequest('С ссылкой на статью что-то не так');
        next(error);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const userId = req.user.id;
  const { _cardId } = req.params;
  articleSchema.findById(_cardId)
    .populate('owner')
    .then((article) => {
      if (article.owner.id === userId) {
        articleSchema.findByIdAndDelete(_cardId)
          .then((thisCard) => {
            res.status(200).send(thisCard);
          });
      } else {
        const err = new ForbiddenError('Запрещено удалять новости других пользователей');
        next(err);
      }
    })
    .catch((err) => {
      if (err) {
        const error = new NotFound('Новость уже удалена');
        next(error);
      }
    });
};
