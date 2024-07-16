const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {User} = require('../models');
const utilities = require('../utilities');

const validuserFields = ['_id', 'username', 'fullname', 'email', 'joinedAt', 'completedTasks', 'totalTasks', 'picture'];
const jwtSecret = String(process.env.JWT_SECRET);

module.exports.signin = async function(req, res) {
    const {username, password} = req.body;

    // So that we can know with what field we are finding the user
    const authMethod = utilities.isValidEmail(username) ? 'email' : 'username';

    const user = await User.findOne({[authMethod]: String(username)});

    if (!user) {
        return utilities.response.format(401, res, new Error('No user with such credentials'));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return utilities.response.format(401, res, new Error('Invalid credentials'));
    }
    const token = jwt.sign({ id: user._id }, jwtSecret);

    // Return only the fields that are required for the user, filter password fields and etc
    let userData = utilities.filterObject(user, validuserFields);

    if (user.completedTasks && user.totalTasks) {
        userData['completionRate'] = Math.round((user.completedTasks / user.totalTasks) * 100);
    }

    utilities.response.format(200, res, {token, message: 'Authentication successful', user: userData});
}