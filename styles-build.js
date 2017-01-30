#! /usr/bin/env node

'use strict';

const gc = require('../gember.config');
const chalk = require('chalk');
const exec = require('child-process-promise').exec;
const logger = require('./logger');

const log = console.log.bind(console);

const arg = require('yargs')
    .option('path', {
        alias: 'p',
        string: true,
        describe: 'specified path/filename that has been modified'
    })
    .argv;

const styles = (arg.path === undefined) ? gc.dir.styles : gc.dir.sources + '/' + arg.path;

// log(chalk.green('[styles:build]: start'));
logger.compile('{start: styles:build, task');
console.time(chalk.green('⌚️  time'));

exec(`node-sass ${styles} \
        --output ${gc.dir.build.styles} \
            --output-style compressed`)
    .then(function (result) {
        const stderr = result.stderr;

        log('\n' + stderr);
        logger.compile('{finished: styles:build, task in...');
        console.timeEnd(chalk.green('⌚️  time'));
        log('\n');
    })
    .catch(function (error) {
        let err = JSON.parse(error.stderr);

        logger.compile('{error: styles:build, 🚒  🚒  🚒  ');
        log(`\n${chalk.dim('File')} ${chalk.red(err.file)}
${chalk.dim('Line')} ${err.line}:${err.column}

${chalk.dim('Message ⤵︎')}
${err.message}`);
    });
