const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {User} = require('../models');
const utilities = require('../utilities');

const auth = module.exports;
const validuserFields = ['_id', 'username', 'fullname', 'email', 'joinedAt'];
const jwtSecret = String(process.env.JWT_SECRET);

auth.signin = async function(req) {
    const {username, password} = req.body;

    // So that we can know with what field we are finding the user
    const authMethod = utilities.isValidEmail(username) ? 'email' : 'username';

    const user = await User.findOne({[authMethod]: String(username)});

    if (!user) {
        return new Error('No user with such credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new Error('Invalid credentials');
    }
    const token = jwt.sign({ id: user._id }, jwtSecret);

    // Return only the fields that are required for the user, filter password fields and etc
    let userData = utilities.filterObject(user, validuserFields);

    return {token, message: 'Authentication successful', user: userData}
}