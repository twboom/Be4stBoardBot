#!/usr/bin/env node
const { log } = require('./functions/utility.js');

// Valid operations
const operations = ['bot', 'deploy-commands']

// Main function
function main() {

    log('system', 'Starting Be4stBoard')

    // Get the arguments
    const args = process.argv.splice(2);
    const operation = args[0];
    if (!operations.includes(operation)) {
        log('followup', `Invalid operation: ${operation}`);
        return;
    } else {
        // Run the operation
        log('followup', `Running ${operation}`)
        require(`./${operation}.js`);
    };    

};

main();