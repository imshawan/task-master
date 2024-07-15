const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');

const middlewares = require('./middlewares');
const database = require('./database');

const router = require('./routes/index');

module.exports.initialize = async function () {
    const app = express();

    // Let the database connection establish first before even the server starts so that if the connection fails, the server stops.
    // Continuing with a failed DB connection does not make sense.
    await database.initializeConnection();
    await initializeExpressServer(app);

    // Mounting the base API router
    app.use('/', router);

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        next(createError(404));
    });

    // error handler
    app.use(middlewares.handleErrors);

    return app;
};

/**
 * @function initializeExpressServer
 * @description All the express level middleware attachments such as auth and etc happens here
 * @param {*} app 
 */
async function initializeExpressServer(app) {
    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');

    app.use(logger('dev'));
    app.use(express.json({ limit: '1mb' }));
    app.use(express.urlencoded({ extended: true, limit: '1mb' }));
    app.use(cookieParser());

    passport.use(middlewares.authentication.JwtStrategy);
    app.use(passport.initialize());
}
