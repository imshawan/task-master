const { ExtractJwt, Strategy: JwtStrategy } = require('passport-jwt');
const _ = require('lodash');
const { User } = require('../models');
const utilities = require('../utilities');
const passport = require('passport');
require('dotenv').config();

const auth = module.exports;

const jwtSecret = String(process.env.JWT_SECRET);
const validuserFields = ['username', 'fullname', 'email'];

// Passport JWT strategy
auth.jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret
};

/**
 * Middleware to validate a JWT token using Passport.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * 
 * @returns {void}
 */
auth.validate = async function (req, res, next) {
    passport.authenticate('jwt', { session: false }, async function (err, userData, info) {
        if (err || !userData) {
            let message = err ? (err.message || err) : (info && info.message ? info.message : 'Unauthorized');
            return utilities.response.format(401, res, {message});
        }
        
        // Add the user data to the request object after a successful authentication
        req.user = userData;

        next();
        
    })(req, res, next);
}

/**
 * JWT strategy for Passport to authenticate users based on a JWT token.
 * 
 * @param {Object} payload - The JWT payload containing user data.
 * @param {Function} done - The callback function to call once the user is authenticated.
 * 
 * @returns {void}
 */
auth.JwtStrategy = new JwtStrategy(this.jwtOptions, async (payload, done) => {
    try {
        const user = await User.findById(payload.id, validuserFields);
        if (user) {
            return done(null, user);
        }
        return done(null, false);
    } catch (error) {
        return done(error, false);
    }
})