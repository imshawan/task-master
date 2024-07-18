const { validationResult } = require('express-validator');
const multer = require('multer');
const fs = require('fs');
const { response } = require('../utilities');
const constants = require('../../constants');

const middlewares = module.exports;

middlewares.authentication = require('./authentication');
middlewares.validators = require('./validators');
middlewares.cors = require('./cors');
middlewares.logger = require('./logger');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync(constants.uploads)) {
            fs.mkdirSync(constants.uploads, { recursive: true });
        }

        cb(null, constants.uploads);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },

});


middlewares.checkRequiredFields = (fields, req, res, next) => {
    if (!fields || !Array.isArray(fields) || !fields.length) return next();

    let missing = []
    for (const field of fields) {
        if (!req.body[field]) missing.push(field);
    }

    if (missing.length) return response.format(400, res, {message: `Missing fields: ${missing.join(', ')}`});

    next();
};

middlewares.validateFields = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return response.format(400, res, errors.array());
    }

    next();
};

middlewares.upload = multer({ storage });