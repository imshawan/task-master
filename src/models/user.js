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
});

// Create model and export
module.exports = model('User', userSchema);