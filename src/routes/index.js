const express = require('express');
const middlewares = require('../middlewares');
const router = express.Router();

router.options('/*', middlewares.cors.cors, (req, res) => res.status(200));

router.use('/api/user', middlewares.cors.corsWithDelegate, require('./user'));
router.use('/api/auth', middlewares.cors.corsWithDelegate, require('./authentication'));
router.use('/api/task', middlewares.cors.corsWithDelegate, middlewares.authentication.validate, require('./task'));

module.exports = router;
