const response = module.exports;

response.format = function (code, response, data = null) {
    let success = code < 400 && !(data instanceof Error);
    let message = success ? 'Ok' : (data && data.message) || 'An error occurred';

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