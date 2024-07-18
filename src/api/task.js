const { isValidObjectId } = require('mongoose');
const _ = require('lodash');
const { Task, User } = require('../models');
const utilities = require('../utilities');

const taskApi = module.exports;
const validTaskFields = ['To Do', 'In Progress', 'Done', 'Discarded'];

taskApi.get = async function (req) {
    const { user } = req;
    const { status, search } = req.query;

    let page = Number(req.query.page) || 1,
        limit = Number(req.query.limit) || 6;
        
    const query = { author: user._id };

    if (status && validTaskFields.includes(status)) {
        query.status = status;
    }
    if (search && search.length > 2) {
        let str = new RegExp(_.escapeRegExp(search)); // Escapes the RegExp special characters in string.

        // The search can either match title or descriprion, providing a holistic searching scope
        query.$or = [
            { title: { $regex: str, $options: 'i' } },
            { description: { $regex: str, $options: 'i' } },
        ]
    }

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

taskApi.create = async function (req) {
    const { user } = req;
    const { title, description, dueDate, status } = req.body;

    const task = new Task({
        title,
        description,
        dueDate,
        status: status || 'To Do',
        author: user._id,
    });

    await task.save();
    await handleUserCounters(user._id, 'totalTasks', 1); // Increment the total tasks for user on creation of a new tassk

    return {
        message: 'Task created successfully',
        task
    }
}

taskApi.update = async function (req) {
    const { user } = req;
    const id = req.params.id;
    const { status } = req.body;

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

    let task = await Task.findOne({ _id: id });
    if (!task) {
        return new Error('Task not found');
    }

    // If the user id is different, means that someone else is trying to update the values (which is not possible, but still handled here)
    if (String(task.author) !== String(user._id)) {
        return new Error('You are not authorized to update this task');
    }
    let prevStatus = task.status, counter = 0;
    task.status = status;

    await task.save();

    // Check if the task status has changed from 'Done' to a different status or vice versa.
    if (prevStatus == 'Done' && status != 'Done') {
        // If the previous status was 'Done' and the new status is not 'Done', decrement the counter.
        counter = -1;
    }
    if (status == 'Done' && prevStatus != 'Done') {
        // If the new status is 'Done' and the previous status was not 'Done', increment the counter.
        counter = 1;
    }

    // If the counter has been changed (i.e., status has transitioned to or from 'Done'),
    // update the user's completed tasks count.
    if (counter !== 0) {
        await handleUserCounters(user._id, 'completedTasks', counter);
    }


    return {
        message: 'Task status was updated'
    }
}

taskApi.remove = async function (req) {
    const { user } = req;
    const id = req.params.id;

    if (!isValidObjectId(id)) {
        return new Error('Invalid task id');
    }

    let task = await Task.findOne({ _id: id });
    if (!task) {
        return new Error('Task not found');
    }
    if (String(task.author) !== String(user._id)) {
        return new Error('You are not authorized to update this task');
    }

    await Task.findByIdAndDelete(id);
    await handleUserCounters(user._id, 'totalTasks', -1); // Decrement the total tasks count for the user as the task is deleted

    if (task.status == 'Done') {
        await handleUserCounters(user._id, 'completedTasks', -1); // Also decrement the completed task count
    }

    return {
        message: 'The task has been deleted successfully'
    }
}


async function handleUserCounters(userId, field, value) {
    await User.findByIdAndUpdate(
        userId,
        { $inc: { [field]: value } },
        { new: true } // This option returns the updated document
    );
}