export * from './constants';

/**
 * Replaces placeholders in an endpoint string with corresponding values from the params object.
 * 
 * @param {string} endpoint - The endpoint string containing placeholders in the form of {{placeholder}}.
 * @param {Object} params - An object containing values to replace the placeholders.
 * 
 * @returns {string} The endpoint string with placeholders replaced by corresponding values from the params object.
 * 
 * @example
 * // Replaces the placeholder {{id}} with the value 123 in the endpoint string
 * const result = parseParams('/api/task/{{id}}', { id: 123 });
 * console.log(result); // Outputs: '/api/task/123'
 * 
 */
export const parseParams = (endpoint, params) => {
    if (!endpoint || !params) {
        return endpoint;
    }
    if (!typeof params === 'object') {
        params = {};
    }
    if (!Object.keys(params).length) {
        return endpoint;
    }

    return endpoint.replace(/{{(.*?)}}/g, (match, paramName) => {
        if (params[paramName] === undefined) {
            return '';
        }
        return params[paramName];
    });
}

export const calculateDueDate = (date) => {
    const now = new Date();
    const target = new Date(date);

    const diffMs = target - now;

    // If the target date is in the past
    if (diffMs < 0) {
        return 'Overdue';
    }

    // Calculate days, hours, and minutes
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHrs = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    let result = 'Due in ';

    if (diffDays > 0) {
        result += `${diffDays}d `;
    }

    if (diffHrs > 0 || diffDays > 0) { // Only include hours if there are hours or days
        result += `${diffHrs}hrs `;
    }

    result += `${diffMins}mins`;

    return result.trim(); // Remove any trailing space
}
