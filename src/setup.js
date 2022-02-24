const path = require('path');
const fs = require('fs');
const { log, prompt } = require('./functions/utility.js');


const files = [
    'permissions.json',
    'authentication.json',
];

const validationTemplate = {
    "clientId": "",
    "guildId": "",
    "token": ""
};

const permissionsTemplate = {
    "soundboard-create": "",
    "channel-join": "",
    "channel-leave": "",
    "help": ""
};

const templates = {
    "authentication.json": validationTemplate,
    "permissions.json": permissionsTemplate,
}

const text = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    underscore: '\x1b[4m',
    reverse: '\x1b[7m',
};


function main() {
    // Get current directory
    const cwd = process.cwd();

    function getPath(file) {
        return path.join(cwd + '/config/', file)
    }
    
    // Create config folder if not alreaady existing
    const configPath = path.join(cwd, 'config');

    log('bot', 'Checking for config directory');

    if (fs.existsSync(configPath) && fs.statSync(configPath).isDirectory()) {
        log('followup', 'Config directory already exists');
    } else {
        log('followup', 'Config directory does not exists');
        fs.mkdirSync(configPath);
        log('followup', 'Config directory made')
    };

    // Create files if they don't exist
    log('bot', 'Checking for needed files');
    for (const file of files) {
        const filePath = path.join(cwd + '/config/', file)
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            log('followup', `${file} already exists`);
        } else {
            log('followup', `${file} does not exists`);
            fs.writeFileSync(filePath, JSON.stringify(templates[file]))
            log('followup', `Made ${file}`)
        };
    };

    // Read the files
    const authentication = JSON.parse(fs.readFileSync(getPath('authentication.json')));
    const permissions = JSON.parse(fs.readFileSync(getPath('permissions.json')));

    console.log('\n');
    console.log(text.reverse, 'Be4stBoard Setup', text.reset);
    console.log('');

    // Authentication
    console.log(text.bold, 'Authentication:', text.reset)
    Object.entries(authentication).forEach(([key, value]) => {
        if (value === "") {
            const input = prompt(`${key}: `);
            authentication[key] = input;
        } else {
            const input = prompt(`${key} (${value}): `);
            if (input !== '') {
                authentication[key] = input;
            };
        };
    });

    console.log('')

    // Permissions
    console.log(text.bold, 'Permissions:', text.reset)
    Object.entries(permissions).forEach(([key, value]) => {
        if (value === "") {
            const input = prompt(`${key}: `);
            permissions[key] = input;
        } else {
            const input = prompt(`${key} (${value}): `);
            if (input !== '') {
                permissions[key] = input;
            };
        };
    });

    console.log('')

    // Review
    console.log(text.bold, 'Please review your choices', text.reset)
    console.log('Authentication:')
    Object.entries(authentication).forEach(([key, value]) => {
        console.log(`  ${key}: ${value}`);
    });
    console.log('Permissions:')
    Object.entries(permissions).forEach(([key, value]) => {
        console.log(`  ${key}: ${value}`);
    });

    fs.writeFileSync(getPath('authentication.json'), JSON.stringify(authentication));
    fs.writeFileSync(getPath('permissions.json'), JSON.stringify(permissions));

};

main();