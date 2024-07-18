const express = require('express');
const router = express.Router();
const middlewares = require('../middlewares');

const apiControllers = require('../controllers');

router.get('/', apiControllers.task.get);
router.post('/', middlewares.checkRequiredFields.bind(null, ['title', 'dueDate']), middlewares.validators.task, apiControllers.task.create);
router.put('/:id', apiControllers.task.update);
router.delete('/:id', apiControllers.task.remove);

module.exports = router;
