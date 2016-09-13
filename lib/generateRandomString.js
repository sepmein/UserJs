module.exports = function generateRandomString(length) {
    return Math.random().toString(36).substring(5, (length || 7) + 5);
};