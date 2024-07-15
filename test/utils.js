
/**
 * @description Added generator functions so that I do not end up in deleting the created same user everytime when any other test cases failed
 * 
 */


module.exports = {
    generateRandomUsername() {
        const randomString = Math.random().toString(36).substring(7);
        return `imshawan-${randomString}`;
    },
    
    generateRandomEmail() {
        const randomString = Math.random().toString(36).substring(7);
        return `contact-${randomString}@imshawan.dev`;
    }
}
