const { log, getPath } = require("./utility.js");
const permissions = require(getPath('permissions'))

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

module.exports = {
    checkPermissions,
};