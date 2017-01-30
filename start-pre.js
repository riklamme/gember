const gc = require('../gember.config');
const chalk = require('chalk');
const log = console.log.bind(console);

log(chalk.green(`                                     
 _____ _____ _____ _____ _____ _____ 
|   __|   __|     | __  |   __| __  |
|  |  |   __| | | | __ -|   __|    -|
|_____|_____|_|_|_|_____|_____|__|__|

       *** ${gc.info.name} [${gc.info.key}] ***

`));