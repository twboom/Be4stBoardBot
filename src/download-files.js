const { log } = require("./functions/utility.js");
const path = require('path');
const fs = require('fs');

const config = {
    soundsLocation: 'https://be4stboard.thijsboom.com/api/sounds.json'
};

function main() {
    // Get current directory
    const cwd = process.cwd();

    // Create cach folder if not alreaady existing
    const cachePath = path.join(cwd, 'cache');

    log('bot', 'Checking for cache directory');

    if (fs.existsSync(cachePath) && fs.statSync(cachePath).isDirectory()) {
        log('followup', 'Cache directory already exists');
    } else {
        log('followup', 'Cache directory does not exists');
        fs.mkdirSync(cachePath);
        log('followup', 'Cache directory made')
    };

};

main();