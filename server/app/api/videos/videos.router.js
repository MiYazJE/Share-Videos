const router = require('express').Router();

const controller = require('./videos.controller');
const validation = require('./videos.validation');

const { userAuthMiddleware } = require('../../middlewares/authMiddlewares');
const { validateSchema } = require('../../middlewares/validation');

router.get(
  '/autocomplete/youtube/:q',
  userAuthMiddleware,
  validateSchema(validation.searchParam),
  controller.autocompleteYoutube,
);

router.get(
  '/youtube/:q',
  userAuthMiddleware,
  validateSchema(validation.searchParam),
  controller.getYoutubeVideos,
);

module.exports = router;
