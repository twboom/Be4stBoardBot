function main() {

    const reset = '\x1b[0m';
    const bold = '\x1b[1m';
    const underscore = '\x1b[4m';
    const reverse = '\x1b[7m';

    console.log(bold, 'Be4stBoard Help', reset);

    console.log(underscore, 'Available operations:', reset);
    console.log('1. bot (Run the Discord bot)');
    console.log('2. deploy-commands (Deploy the slashcommands)')
    console.log('');
    console.log(underscore, 'How to run', reset);
    console.log('Run', reverse, 'be4stboard {operation}', reset, 'to run your operation of choice')

};

main();