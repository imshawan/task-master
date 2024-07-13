const { body } = require('express-validator');

module.exports = {
    regsteration: [
        body('username').isLength({ min: 5 }).withMessage('Username must be at least 5 characters long'),
        body('fullname').isLength({ min: 5 }).withMessage('Fullname must be at least 5 characters long'),
        body('email').isEmail().withMessage('Please enter a valid email address'),
        body('password').isString().isLength({ min: 4 }).withMessage('Password must be at least 4 characters long'),
    ],
    signin: [
        body('username').notEmpty().withMessage('Username/email id is required'),
        body('password').notEmpty().withMessage('Password is required'),
    ]
};