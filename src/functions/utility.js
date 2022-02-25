const types = {
    'system': '@',
    'bot': '+',
    'interaction': '*',
    'followup': '->',
    'warning': '!',
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

// Synchronously prompt for input
function prompt(message) {
    const os = require('os')
    const child_process = require('child_process')

    // Write message
    process.stdout.write(message);

    // Work out shell command to prompt for a string and echo it to stdout
    let cmd;
    let args;
    if (os.platform() == "win32") {
        cmd = 'cmd';
        args = [ '/V:ON', '/C', 'set /p response= && echo !response!' ];
    } else {
        cmd = 'bash';
        args = [ '-c', 'read response; echo "$response"' ];
    }

    // Pipe stdout back to self so we can read the echoed value
    let opts = { 
        stdio: [ 'inherit', 'pipe', 'inherit' ],
        shell: false,
    };

    // Run it
    return child_process.spawnSync(cmd, args, opts).stdout.toString().trim();
};

// Get path of config file
function getPath(file) {
    const path = require('path');
    const cwd = process.cwd();
    return path.join(cwd + '/config/', file + '.json')
};

// Get the time
function getTime() {
    const date = new Date();
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};

// Download a file
async function download(url, file) {
    const fs = require('fs');

    url = new URL(url); // Convert to URL object
    let http;
    if (url.protocol === 'https:') {
        http = require('https');
    } else {
        http = require('http');
    };

    return new Promise(async resolve => {
        const output = fs.createWriteStream(file);
        const request = http.get(url.href, r => {
            r.pipe(output);
            output.on('finish', async _ => {
                await output.close()
                resolve()
            })
        });
    })
};

// Export
module.exports = {
    log,
    prompt,
    getPath,
    download,
}