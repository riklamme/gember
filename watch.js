#! /usr/bin/env node

'use strict';

const gc = require('../gember.config');
const chalk = require('chalk');
const chokidar = require('chokidar');
const exec = require('shelljs').exec;

const logger = require('./logger');

// Something to use when events are received.
const log = console.log.bind(console);

// Initialize watcher.
const watcher = chokidar.watch('.', {
    cwd: gc.dir.sources,
    ignorePermissionErrors: true
});


// logger.compile("{warn: styles:build, There are warnings in your syntax...");
//
// logger.compile("{error: styles:build, Could not write file to build folder...");
//
// logger.compile("{info: styles:build, Read file...");
//
// logger.compile("{debug: styles:build, debugger used to read value");

// run task, pass on file
const run = (task, file) => {

    // log(file);
    let path = file.split('/');

    switch (task) {
        case 'styles': {
            // log(chalk.green(`[watch]: Run => [styles]`));
            logger.compile(`{run: watch, styles`);

            if (path.length > 2) {
                exec(`npm run styles -s --colors`);
            } else {
                exec(`npm run styles:lint -s --colors && npm run styles:build -s -- --path ${file} --colors && npm run styles:post -s --colors`);
            }

            break;
        }
        case 'templates': {
            // log(chalk.green(`[watch]: Run => [templates]`));
            logger.compile(`{run: watch, templates`);

            if (path.length > 2) {
                exec(`npm run templates -s --colors`);
            } else {
                exec(`npm run templates -s -- --path ${file} --colors`);
            }

            break;
        }
        case 'svg': {
            // log(chalk.green(`[watch]: Run => [svg:sprite]`));
            logger.compile(`{run: watch, svg:sprite`);
            exec(`npm run svg:sprite -s`);
            break;
        }
        case 'gfx': {
            // log(chalk.green(`[watch]: Run => [gfx:gfx]`));
            logger.compile(`{run: watch, gfx:gfx`);
            exec('npm run gfx:gfx -s');
            break;
        }
        case 'images': {
            // log(chalk.green(`[watch]: Run => [gfx:images]`));
            logger.compile(`{run: watch, gfx:images`);
            exec('npm run gfx:images -s');
            break;
        }
        case 'scripts': {
            // log(chalk.green(`[watch]: Run => [scripts]`));
            logger.compile(`{run: watch, scripts`);
            // exec(`shell-exec --colored-output --quiet 'npm run scripts -s'`);
            exec(`npm run scripts:bundle -s -- --bundle ${path[1]} --colors`);
            break;
        }
        default: {
            // log(chalk.red(`[watch]: WARNING => ${task} not found`));
            logger.compile(`{error: watch, ${task} not found`);
        }
    }
};

watcher.on('ready', () => {
    // log(chalk.green('[watch]: Ready, watching for changes'));

    logger.compile("{ready: watch, watching all the sources files...");

    watcher.on('change', (file, stats) => {
        const fSplit = file.split('/');
        const task = fSplit[0];
        const dirCheck = fSplit[1];

        if (dirCheck.startsWith('_')) {
            return false;
        }

        // log(chalk.blue(`[watch]: Changed => ${file}`));

        logger.compile(`{change: watch, ${file}`);


        if (stats) {
            log(`File ${file} changed size to ${stats.size}`);
        }

        run(task, file);
    });

    watcher.on('add', (file, stats) => {
        // log(chalk.magenta(`[watch]: Added => ${file}`));
        logger.compile(`{add: watch, ${file}`);

        const task = file.split('/')[0];

        if (stats) {
            log(`File ${file} changed size to ${stats.size}`);
        }

        run(task, file);
    });
});

watcher
    .on('error', error => log(chalk.red(`[watch]: ERROR: ${error}`)))
    .on('unlink', path => log(chalk.red(`[watch]: Removed => ${path}`)))
    .on('unlinkDir', path => log(chalk.red(`[watch]: Removed Dir => ${path}`)));
