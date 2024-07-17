var cors = require('cors')

var whitelist = ['http://localhost:4000', 'https://api-task-master-wu2f.onrender.com'];

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