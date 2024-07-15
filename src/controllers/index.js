/**
 * @description The controllers are kept separate from the API logic. 
 * The controller calls the API logic from it's own file and the response is passed to the response formatter function.
 * 
 * Also, the error handling can be taken off by the response formatter function.
 * We only return the error in the API logic without throwing it and let the response formatter function handle the response.
 */

module.exports = {
    user: require('./user'),
    authentication: require('./authentication'),
    task: require('./task'),
}