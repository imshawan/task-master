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