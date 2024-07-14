const bcrypt = require('bcryptjs');
const {User} = require('../models');
const utilities = require('../utilities');

const user = module.exports;
const validuserFields = ['_id', 'username', 'fullname', 'email', 'joinedAt', 'completedTasksCount', 'totalTasks'];

user.register = async function (req, res) {
    const {username, email, password, fullname} = req.body;

    let [userWithEmailExists, userWithUsernameExists] = await Promise.all([
        User.findOne({email}),
        User.findOne({username}),
    ]);
    if (userWithEmailExists || userWithUsernameExists)  {
        return new Error('An user with this email/username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 16);
    const user = new User({ username, password: hashedPassword, email, fullname });
    await user.save();

    let userData = utilities.filterObject(user, validuserFields);

    return { message: 'User registered successfully', user: userData }
}

user.get = async function (req) {
    return await User.findById(req.user._id, validuserFields);
}

user.update = async function (req) {
    const {fullname} = req.body;
    if (!fullname) return;

    const user = await User.findById(req.user._id);
    if (user.fullname === fullname) return;

    user.fullname = fullname;

    await user.save();

    return { message: 'User updated successfully' };
}