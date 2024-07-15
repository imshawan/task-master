const bcrypt = require('bcryptjs');
const {User} = require('../models');
const utilities = require('../utilities');

const user = module.exports;
const validuserFields = ['_id', 'username', 'fullname', 'email', 'joinedAt', 'completedTasks', 'totalTasks'];

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
    let user = await User.findById(req.user._id, validuserFields);
    let {completedTasks, totalTasks} = user;
    
    user.completedTasks = completedTasks || 0;
    user.totalTasks = totalTasks ||  0;
    user.completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return user
}

// As of now, let's only allow the users to update their full name
user.update = async function (req) {
    const {fullname} = req.body;
    if (!fullname) return;

    const user = await User.findById(req.user._id);
    if (user.fullname === fullname) return;

    user.fullname = fullname;

    await user.save();

    return { message: 'User updated successfully' };
}