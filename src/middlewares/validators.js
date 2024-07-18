const { body } = require('express-validator');

/**
 * @file This file contains validation rules for user registration, sign-in, task creation and etc.
 * using the express-validator library.
 * 
 * The validation rules ensure that the required fields are provided and adhere to the specified formats
 * before proceeding with further request handling.
 * 
 * @module validators
 */

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
    ],
    task: [
        body('title').isString().trim().notEmpty().withMessage('Title is required'),
        body('description').optional(),
        body('status')
            .optional()
            .isString()
            .trim()
            .isIn(['To Do', 'In Progress', 'Done', 'Discarded'])
            .withMessage('Invalid status value'),
        body('dueDate').notEmpty().isISO8601().toDate().withMessage('Invalid due date'),
    ]
};