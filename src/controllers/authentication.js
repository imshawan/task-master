const api = require('../api');
const { response } = require('../utilities');

module.exports = {
    async signin (req, res) {
        response.format(200, res, await api.authentication.signin(req));
    },
}