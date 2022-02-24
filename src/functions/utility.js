const permissions = require('../config/permissions.json')

const types = {
    'bot': '+',
    'interaction': '*',
    'followup': '->'
}

// Log message
function log(type, message) {
    const prefix = types[type];
    const time = getTime();

    let output;

    if (type === 'followup') {
        output = `   [${prefix}] ${message}` 
    } else {
        output = `[${prefix}] [${time}]  ${message}`
    };

    console.log(output)
};

// Check permissions
async function checkPermissions(interaction, action) {
    let role = permissions[action]
    if (role === undefined || role === "") { role === everyone };

    // If role is everyone, return 
    if (role === "everyone") { return true };

    const roles = interaction.member.roles.cache;

    const roleId = roles.has(role);
    const roleName = roles.some(r => r.name === role);

    if (roleId || roleName) { return true };

    await interaction.reply({
        content: 'You do not have required role to perform this action',
        ephemeral: true
    })

    log('followup', `User ${interaction.user.tag} does not have required role to perform this action`)

    return false

};

// Get the time
function getTime() {
    const date = new Date();
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};

// Export
module.exports = {
    log,
    checkPermissions,
}