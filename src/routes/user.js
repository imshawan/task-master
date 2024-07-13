const express = require('express');
const router = express.Router();
const middlewares = require('../middlewares');

const apiControllers = require('../controllers');

router.get('/', middlewares.authentication.validate, apiControllers.user.get);
router.post('/register', middlewares.validators.regsteration, middlewares.validateFields, apiControllers.user.register);

module.exports = router;
