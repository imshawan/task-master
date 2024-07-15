const response = module.exports;

/**
 * Formats the data into a standardized response payload and sends a JSON response.
 * 
 * @param {number} code - The HTTP status code.
 * @param {Object} response - The response object.
 * @param {Object|null} [data=null] - The data to include in the response payload. If an Error object is provided, its message will be used.
 * 
 * @returns {void}
 */
response.format = function (code, response, data = null) {
    let success = code < 400 && !(data instanceof Error);
    let message = success ? 'Ok' : (data && data.message) || 'An error occurred';

    code = success ? code : (code > 399 ? code : 400);

    const payload = {
        status: {
            success,
            message,
        },
        response: data || {},
    };

    response.setHeader('Content-Type', 'application/json');
    response.status(code).json(payload);
}