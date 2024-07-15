const utils = require('./utils');

/**
 * @description Dummy data which will be used throughout the testing process
 */

const currentDate = new Date()
currentDate.setHours(currentDate.getHours() + 24);

module.exports.user = {
    username: utils.generateRandomUsername(),
    fullname: 'Shawan Mandal',
    email: utils.generateRandomEmail(),
    password: 'password123'
};
module.exports.task = {
    title: 'New Task',
    description: 'Task description',
    status: 'To Do',
    dueDate: currentDate.toISOString() // Let the due date be 24 hours from now
}