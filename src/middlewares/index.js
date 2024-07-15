const { validationResult } = require('express-validator');
const { response } = require('../utilities');

const middlewares = module.exports;

middlewares.authentication = require('./authentication');
middlewares.validators = require('./validators');
middlewares.cors = require('./cors');


middlewares.checkRequiredFields = (fields, req, res, next) => {
    if (!fields || !Array.isArray(fields) || !fields.length) return next();

    let missing = []
    for (const field of fields) {
        if (!req.body[field]) missing.push(field);
    }

    if (missing.length) return response.format(400, res, `Missing fields: ${missing.join(', ')}`);

    next();
};

middlewares.validateFields = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return response.format(400, res, errors.array());
    }
    
    next();
};

middlewares.handleErrors = async (err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
}