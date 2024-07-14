const { isValidObjectId } = require('mongoose');
const _ = require('lodash');
const {Task, User} = require('../models');
const utilities = require('../utilities');

const taskApi = module.exports;
const validTaskFields = ['To Do', 'In Progress', 'Done', 'Discarded'];

taskApi.get = async function(req) {
    const {user} = req;
    const { page = 1, limit = 10, status, search } = req.query;
    const query = {author: user._id};

    if (status && validTaskFields.includes(status)) {
        query.status = status;
    }
    if (search && search.length > 2) {
        let str = new RegExp(_.escapeRegExp(search));
        query.$or = [
            {title: {$regex: str, $options: 'i'}},
            {description: {$regex: str, $options: 'i'}},
        ]
    }

    console.log(query)

    const [tasks, total] = await Promise.all([
        Task.find(query).sort({ createdAt: -1 }).limit(limit * 1).skip((page - 1) * limit).exec(),
        Task.countDocuments(query),
    ]);

    return {
        tasks,
        totalPages: Math.ceil(total / limit),
        nextPage: page < Math.ceil(total / limit) ? page + 1 : null,
        currentPage: page,
    }
}

taskApi.create = async function(req) {
    const {user} = req;
    const {title, description, dueDate, status} = req.body;

    const task = new Task({
        title,
        description,
        dueDate,
        status,
        author: user._id,
    });

    await task.save();

    return {
        message: 'Task created successfully',
        task
    }
}

taskApi.update = async function(req) {
    const {user} = req;
    const id = req.params.id;
    const {status} = req.body;

    if (!id) {
        return new Error('Task id is required');
    }

    if (!isValidObjectId(id)) {
        return new Error('Invalid task id')
    }
    if (!status) return new Error('Status is required');

    if (!validTaskFields.includes(status)) {
        throw new Error('Invalid status ' + status);
    }

    let task = await Task.findOne({_id: id});
    if (!task) {
        return new Error('Task not found');
    }
    if (String(task.author) !== String(user._id)) {
        return new Error('You are not authorized to update this task');
    }
    let prevStatus = task.status, counter = 0;
    task.status = status;

    await task.save();
    if (prevStatus == 'Done' && status != 'Done') {
        counter = -1;
    }
    if (status == 'Done' && prevStatus != 'Done') {
        counter = 1;
    }
    
    if (counter !== 0) {
        await handleUserCounters(user._id, 'completedTasksCount', counter);
    }

    return {
        message: 'Task status was updated'
    }
}

taskApi.remove = async function(req) {
    const {user} = req;
    const id = req.params.id;

    if (!isValidObjectId(id)) {
        return new Error('Invalid task id');
    }

    let task = await Task.findOne({_id: id});
    if (!task) {
        return new Error('Task not found');
    }
    if (String(task.author) !== String(user._id)) {
        return new Error('You are not authorized to update this task');
    }

    await Task.findByIdAndDelete(id);
    await handleUserCounters(user._id, 'tasksCount', -1);

    if (task.status == 'Done') {
        await handleUserCounters(user._id, 'completedTasksCount', -1);
    }

    return {
        message: 'The task has been deleted successfully'
    }
}


async function handleUserCounters (userId, field, value) {
    await User.findByIdAndUpdate(
        userId,
        { $inc: { [field]: value } },
        { new: true } // This option returns the updated document
      );
}