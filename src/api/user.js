const bcrypt = require('bcryptjs');
const path = require('path');
const {User} = require('../models');
const utilities = require('../utilities');
const constants = require('../../constants');

const user = module.exports;
const validuserFields = ['_id', 'username', 'fullname', 'email', 'joinedAt', 'completedTasks', 'totalTasks', 'picture'];

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

// As of now, let's only allow the users to update their full name and picture
user.update = async function (req) {
    const {fullname} = req.body;
    let fields = 0;

    const user = await User.findById(req.user._id);
    if (fullname && user.fullname === fullname) return;

    const {file} = req;

    if (fullname) {
        user.fullname = fullname;
        fields++;
    }

    if (file) {
        let {filename} = file;
        let uploadsDir = path.basename(constants.uploads);
        
        user.picture = `/${uploadsDir}/${filename}`;

        fields++;
    }

    if (!fields) return;

    await user.save();

    return { message: 'User updated successfully', ...(file ? {picture: user.picture} : {}) };
}