const api = require('../api');
const { response } = require('../utilities');

module.exports = {
    async register (req, res) {
        response.format(200, res, await api.user.register(req));
    },
    async get (req, res) {
        response.format(200, res, await api.user.get(req));
    },
    async update (req, res) {
        response.format(200, res, await api.user.update(req));
    },
}