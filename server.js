#! /usr/bin/env node

const gc = require('../gember.config');
const chalk = require('chalk');
const exec = require('shelljs').exec;

const log = console.log.bind(console);

log(chalk.green(`[server]: => start`));
console.time(chalk.green(`[server]: build files => finished in`));


exec("npm run build:setup -s && parallelshell 'npm run styles:build -s && npm run styles:post -s' 'npm run scripts -s' 'npm run gfx -s' -s", function () {
    console.timeEnd(chalk.green(`[server]: build files => finished in`));
    copyFiles();
});

function copyFiles() {
    console.time(chalk.green(`[server]: copy files => finished in`));
    exec(`cp build/resources/styles/* ../ext/${gc.server.ext_key}/Resources/Public/StyleSheets \
            && \
          cp build/resources/scripts/* ../ext/${gc.server.ext_key}/Resources/Public/JavaScript \
            && \
          cp build/resources/gfx/* ../ext/${gc.server.ext_key}/Resources/Public/GFX`, function () {
        console.timeEnd(chalk.green(`[server]: copy files => finished in`));
    });
}

