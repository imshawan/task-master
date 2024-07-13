const utils = module.exports;

utils.response = require('./response');

utils.isValidEmail = function (email) {
    const isValid = String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );

    return Boolean(isValid && isValid.length);
};

utils.filterObject = function (obj, fields) {
    if (!Object.keys(obj).length) return obj;
    if(!fields || !Array.isArray(fields) || !fields.length) return obj;

    let clone = {};
    fields.forEach(field => (obj[field] ? (clone[field] = obj[field]) : obj[field] = null));

    return clone;
}