const { log, download } = require("./functions/utility.js");
const path = require('path');
const fs = require('fs');

const config = {
    soundsLocation: 'https://be4stboard.twboom.dev/api/sounds.json',
    soundRoot: 'https://be4stboard.twboom.dev/',
};

async function main() {
    // Get current directory
    const cwd = process.cwd();

    // Create cach folder if not alreaady existing
    const cachePath = path.join(cwd, 'cache');

    log('bot', 'Checking for cache directory');

    if (fs.existsSync(cachePath) && fs.statSync(cachePath).isDirectory()) {
        log('followup', 'Cache directory already exists');
        if (fs.readdirSync(cachePath).length > 0) {
            fs.rmSync(cachePath, { recursive: true, force: true });
            fs.mkdirSync(cachePath);
            log('followup', 'Cache directory cleared');
        };
    } else {
        log('followup', 'Cache directory does not exists');
        fs.mkdirSync(cachePath);
        log('followup', 'Cache directory made')
    };

    // Download sounds.json
    log('bot', 'Downloading for sounds.json');
    const soundsPath = path.join(cachePath, 'sounds.json');
    await download(config.soundsLocation, soundsPath);
    log('followup', 'Sounds.json downloaded');

    // Read sounds.json
    log('bot', 'Loading sounds');
    const sounds = JSON.parse(fs.readFileSync(soundsPath));
    log('followup', 'Sounds loaded');

    // Download sounds
    log('bot', 'Downloading sounds');
    let pending = [];
    for (const sound of sounds) {
        const soundUrl = config.soundRoot + sound.path;
        const soundPath = path.join(cachePath, `${sound.slug}.${sound.extension}`);
        pending.push(download(soundUrl, soundPath));
        log('followup', `Downloaded ${sound.slug}.${sound.extension}`);
    };

    await Promise.all(pending);

    log('bot', 'Finished downloading all files');

};

main();