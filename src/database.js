const mongoose = require('mongoose');
require('dotenv').config();

const db = module.exports;

db.initializeConnection = async function () {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.info('Connection to database was successful!')
    } catch (err) {
        console.error(err.message);

        // Gracefully exiting
        process.exit(0);
    }
}