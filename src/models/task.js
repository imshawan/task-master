const {Schema, model} = require('mongoose');

const TaskSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['To Do', 'In Progress', 'Done', 'Discarded'],
        default: 'To Do'
    },
    dueDate: {
        type: Date,
        required: true,
        default: null
    },
    author: {
        type: Schema.Types.ObjectId, 
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: () => new Date().toISOString()
    },
    updatedAt: {
        type: Date,
        default: () => new Date().toISOString()
    }
});

// Middleware to update `updatedAt` field on every save
TaskSchema.pre('save', function (next) {
    this.updatedAt = new Date().toISOString();
    next();
});

module.exports = model('task', TaskSchema);
