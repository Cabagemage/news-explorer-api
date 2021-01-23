const cardsRouter = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const {
  getArticles,
  createArticle,
  deleteArticle,
} = require('../controllers/articles');

cardsRouter.get('/', getArticles);

cardsRouter.delete('/:_articleId', celebrate({
  params: Joi.object().keys({
    _articleId: Joi.string().hex().required().length(24),
  }),
}), deleteArticle);

cardsRouter.post('/', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required().min(2).max(30),
    title: Joi.string().required().min(3),
    text: Joi.string().required().min(2).max(87),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required(),
    image: Joi.string().required(),
  }),
}), createArticle);

module.exports = cardsRouter;
