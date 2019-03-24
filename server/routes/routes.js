const express = require('express');
const indexController = require('../controllers/index.controller');
const userController = require('../controllers/user.controller');

const router = express.Router();

module.exports = () => {
  router.get('/logout', (req, res) => {
    userController.logout(req, res);
  });

  router.get('/login', indexController);
  router.get('/search', indexController);
  router.get('/score', indexController);
  router.get('/', indexController);

  return router;
};
