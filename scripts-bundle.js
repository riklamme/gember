#! /usr/bin/env node

'use strict';

const gc = require('../gember.config');
const chalk = require('chalk');
const exec = require('shelljs').exec;
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

const log = console.log.bind(console);

const arg = require('yargs')
    .option('bundle', {
        alias: 'b',
        string: true,
        describe: 'specified bundle that has been modified'
    })
    .argv;

if (!arg.bundle) {
    createBundles();
} else {
    createBundle(arg.bundle);
}

log(chalk.green(`[scripts:bundle]: => start`));

function create(bundle) {
    let bundleName = bundle.split('.')[1];

    console.time(chalk.green(`[scripts:bundle]: ${bundleName} => finished in`));

    exec(`rollup -c sources/scripts/${bundle} --colors`, function () {
        console.timeEnd(chalk.green(`[scripts:bundle]: ${bundleName} => finished in`));
    });
}

function createBundle(bundle) {
    if (bundle.startsWith('rollup')) {
        bundle = bundle.split('.')[1];
    }

    let bundleConfig = `rollup.${bundle}.config.js`;
    create(bundleConfig);
}

function createBundles() {
    const getFiles = function () {
        return fs.readdirAsync(gc.dir.scripts);
    };

    getFiles().map(filename => {
        return filename;
    }).filter(item => {
        return item.startsWith('rollup');
    }).then(configs => {
        for (let config in configs) {
            create(configs[config]);
        }
    });
}
