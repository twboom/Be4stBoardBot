const types = {
    'bot': '+',
    'interaction': '*',
    'followup': '->'
}

// Log message
function log(type, message) {
    const prefix = types[type];

    const output = `[${prefix}] [${getTime()}]  ${message}`

    console.log(output)
};

// Get the time
function getTime() {
    const date = new Date();
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};

// Export
module.exports = {
    log
}