#! /usr/bin/env node

const gc = require('../gember.config');
const chalk = require('chalk');
const exec = require('child-process-promise').exec;
const logger = require('./logger');
const fs = require('fs');

const log = console.log.bind(console);

logger.compile('{start: styles:post, task');
console.time(chalk.green('⌚️  time'));

exec(`rm -rf ${gc.dir.build.styles}/*.css.map \
        && \
        postcss \
            --use autoprefixer --autoprefixer.browsers 'last 2 version' \
            --replace ${gc.dir.build.styles}/* \
            --map file`)
    .then(function (result) {
        const stderr = result.stderr;

        if (stderr) {
            log('\n',stderr,'\n');
        }

        console.timeEnd(chalk.green('⌚️  time'));
        log('\n');
    })
    .catch(function (error) {
        logger.compile('{error: styles:post, 🚒  🚒  🚒  ');
        log(`${error.stderr}`);
    });
