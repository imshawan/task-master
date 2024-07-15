const express = require('express');
const router = express.Router();
const middlewares = require('../middlewares');

const apiControllers = require('../controllers');

/**
 * This file would deal with only the auth level routes
 */

router.post('/signin', middlewares.validators.signin, middlewares.validateFields, apiControllers.authentication.signin);

module.exports = router;
