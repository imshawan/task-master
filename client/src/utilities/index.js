export * from './constants';
export * from './http';

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
