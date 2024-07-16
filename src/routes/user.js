const express = require('express');
const router = express.Router();
const middlewares = require('../middlewares');

const apiControllers = require('../controllers');

router.get('/', middlewares.authentication.validate, apiControllers.user.get);
router.put('/', middlewares.authentication.validate, middlewares.upload.single('picture'), apiControllers.user.update);
router.post('/register', middlewares.checkRequiredFields.bind(null, ['username', 'fullname', 'email', 'password']), middlewares.validators.regsteration, middlewares.validateFields, apiControllers.user.register);

module.exports = router;
