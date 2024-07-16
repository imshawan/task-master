const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;
const path = require('path');
const constants = require('../../constants');

// Formatter for logging the outputs
const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

// Create a logger instance
const logger = createLogger({
    format: combine(
        timestamp(),
        logFormat
    ),
    transports: [
        new transports.Console(),  // For console loggings
        // Separate file transports for different log levels
        new transports.File({
            filename: path.resolve(constants.logsDir, 'output.log'),
            level: 'info',
            format: combine(
                format((info) => {
                    return info.level === 'error' ? false : info;
                })(),
                timestamp(),
                logFormat
            )
        }),

        new transports.File({
            filename: path.resolve(constants.logsDir, 'error.log'),
            level: 'error',
            format: combine(
                format((info) => {
                    return info.level !== 'error' ? false : info;
                })(),
                timestamp(),
                logFormat
            )
        })
    ],
    exceptionHandlers: [
        new transports.File({ filename: path.resolve(constants.logsDir, 'error.log') })  // Log uncaught exceptions to a separate file instead of the main to avoid confusion
    ],
    exitOnError: false  // Continue logging even if an error occurs
});

// Override console methods to redirect to Winston logger
const { log, warn, error } = console;

console.log = function (...args) {
    logger.info(args.join(' '));
    log(...args);
};

console.warn = function (...args) {
    logger.warn(args.join(' '));
    warn(...args);
};

console.error = function (...args) {
    logger.error(args.join(' '));
    error(...args);
};

// Create a stream object with a 'write' function that will be used by Morgan
const morganStream = {
    write: function (message) {
        logger.info(message.trim());  // Using only logger.info() for Morgan logs
    }
};

module.exports = { ...logger, morganStream };
