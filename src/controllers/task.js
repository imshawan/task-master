const api = require('../api');
const { response } = require('../utilities');

module.exports = {
    async get (req, res) {
        response.format(200, res, await api.task.get(req));
    },
    async create (req, res) {
        response.format(200, res, await api.task.create(req));
    },
    async update (req, res) {
        response.format(200, res, await api.task.update(req));
    },
    async remove (req, res) {
        response.format(200, res, await api.task.remove(req));
    },
}