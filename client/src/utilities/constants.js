export const endpoints = {
    REGISTER: '/api/user/register',
    SIGN_IN: '/api/auth/signin',
    UPDATE_PROFILE: '/api/user',
    CREATE_TASK: '/api/task',
    GET_TASKS: '/api/task?{{query}}',
    UPDATE_TASK: '/api/task/{{id}}',
    DELETE_TASK: '/api/task/{{id}}',
}