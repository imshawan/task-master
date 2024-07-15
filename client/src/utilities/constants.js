/**
 * @file This file defines the API endpoints used in the application.
 * 
 * The `endpoints` object provides a centralized place for managing
 * the paths to various API resources, facilitating easy updates and
 * consistent usage across the codebase.
 * 
 * @module endpoints
 */

export const endpoints = {
    REGISTER: '/api/user/register',
    SIGN_IN: '/api/auth/signin',
    UPDATE_PROFILE: '/api/user',
    GET_PROFILE: '/api/user',
    CREATE_TASK: '/api/task',
    GET_TASKS: '/api/task?{{query}}',
    UPDATE_TASK: '/api/task/{{id}}',
    DELETE_TASK: '/api/task/{{id}}',
}