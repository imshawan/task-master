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

/**
 * Filters an object to include only specified fields.
 * 
 * @param {Object} obj - The object to filter.
 * @param {Array<string>} fields - The array of field names to retain in the filtered object.
 * 
 * @returns {Object} The filtered object containing only the specified fields. If the specified fields are not present, they will be set to `null`.
 */
utils.filterObject = function (obj, fields) {
    if (!Object.keys(obj).length) return obj;
    if(!fields || !Array.isArray(fields) || !fields.length) return obj;

    let clone = {};
    fields.forEach(field => (obj[field] ? (clone[field] = obj[field]) : obj[field] = null));

    return clone;
}