#!/usr/bin/env node

// Valid operations
const operations = ['bot', 'deploy-commands']

// Main function
function main() {

    // Get the arguments
    const args = process.argv.splice(2);
    const operation = args[0];
    if (!operations.includes(operation)) {
        console.log(`Invalid operation: ${operation}`);
        return;
    };

    // Run the operation
    require(`./${operation}.js`);

};

main();