const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const {rateLimit} = require('express-rate-limit');

const middlewares = require('./middlewares');
const database = require('./database');
const constants = require('../constants');

const router = require('./routes/index');

module.exports.initialize = async function () {
    const app = express();

    // Let the database connection establish first before even the server starts so that if the connection fails, the server stops.
    // Continuing with a failed DB connection does not make sense.
    await database.initializeConnection();
    await initializeExpressServer(app);

    // Serve static files from uploads
    app.use('/uploads', express.static(constants.uploads));
    
    // Mounting the base API router
    app.use('/', router);

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        next(createError(404));
    });

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

    app.use(logger('dev',  {stream: middlewares.logger.morganStream}));
    app.use(express.json({ limit: '1mb' }));
    app.use(express.urlencoded({ extended: true, limit: '1mb' }));
    app.use(cookieParser());
    app.use(rateLimit({
        windowMs: 5 * 60 * 1000, // 5 minutes
        limit: 200, // Limit each IP to 200 requests per `window`
        standardHeaders: 'draft-7',
    }));

    // error handler
    app.use((err, req, res, next) => {
        middlewares.logger.error(`Error: ${err.message}`, err);

        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};
    
        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });

    passport.use(middlewares.authentication.JwtStrategy);
    app.use(passport.initialize());
}
