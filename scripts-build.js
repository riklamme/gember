#! /usr/bin/env node

const gc = require('../gember.config');
const chalk = require('chalk');
const exec = require('child-process-promise').exec;

const log = console.log.bind(console);

exec(`rm -rf ${gc.dir.build.scripts}/*`);

Object.keys(gc.scripts.bundles).forEach(function (key) {
    console.time(chalk.green(`[scripts:build]: ${key} => finished in`));
    log(chalk.green(`[scripts:build]: ${key} => start`));

    const keyFile = key.replace(/_/g,'.');

    exec(`uglifyjs ${gc.scripts.bundles[key]} \
            --compress \
            --mangle \
            --output ${gc.dir.build.scripts}/${gc.info.key}.${keyFile}.min.js \
            --source-map ${gc.dir.build.scripts}/${gc.info.key}.${keyFile}.min.js.map`)
        .then(function () {
            log(chalk.blue(`Rendering Complete, saving .js file...
Wrote JS to ${gc.dir.build.scripts}/${gc.info.key}.${keyFile}.min.js`));

            console.timeEnd(chalk.green(`[scripts:build]: ${key} => finished in`));
        })
        .catch(function (error) {
            console.error(chalk.red('[scripts:build]: ERROR =>', error));
        });
});
