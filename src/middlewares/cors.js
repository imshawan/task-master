var cors = require('cors')

var whitelist = ['http://localhost:4000'];

var corsOptionsDelegate = function (req, callback) {
    var corsOptions;
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true }
    } else {
        corsOptions = { origin: false }
    }
    callback(null, corsOptions) // callback expects two parameters: error and options
}

module.exports = {
    cors: cors(),
    corsWithDelegate: cors(corsOptionsDelegate)
}