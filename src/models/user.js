const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    fullname: {
        type: String,
        required: true,
    },
    picture: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address'],
    },
    password: {
        type: String,
        required: true,
    },
    joinedAt: {
        type: Date,
        default: () => new Date().toISOString(),
    },
    completedTasks: {
        type: Number,
        default: 0,
    },
    totalTasks: {
        type: Number,
        default: 0,
    },
    completionRate: {
        type: Number,
        default: 0,
    },
});

// Create model and export
module.exports = model('User', userSchema);