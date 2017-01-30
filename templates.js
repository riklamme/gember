#! /usr/bin/env node

'use strict';

const gc = require('../gember.config');
const chalk = require('chalk');
const fs = require('fs');
const matter = require('gray-matter');
const glob = require('glob');
const mkdirp = require('mkdirp');
const nunjucks = require('nunjucks');
const path = require('path');

const log = console.log.bind(console);

const arg = require('yargs')
    .option('path', {
        alias: 'p',
        string: true,
        describe: 'specified path/filename that has been modified'
    })
    .argv;

const templates = (arg.path === undefined) ? '*.nunjucks' : arg.path.replace('templates/','');

/**
 * Declare nav object
 * @type {Array}
 */
const oNav = [];

/**
 * Set default options
 */
const options = {
    source: gc.dir.templates,
    build: gc.dir.dest,
    srcPaths: ['sources/templates', 'sources/templates/layouts', 'sources/templates/partials', 'sources/templates/macros'] || '',
    nunjucks: {
        trimBlocks: true,
        lstripBlocks: true,
        noCache: true
    }
};

/**
 * Parse second argument as data context if any
 */
// options.context = (argv._[1]) ? JSON.parse(fs.readFileSync(argv._[1], 'utf8')) : {};

/**
 * Set glob options
 */
options.glob = {
    strict: true,
    cwd: path.resolve(process.cwd(), options.source),
    ignore: '**/_*.*',
    nonull: true
};

/**
 * Set Nunjucks environement
 */
const env = nunjucks.configure(options.srcPaths, options.nunjucks);

/**
 * Set Nunjucks filters
 */
const filters = require(gc.dir.templates + '/filters/global-filters.js');

/** Loop throught the filters and add them to the Nunjucks environment */
for (let name in filters) {
    env.addFilter(name, filters[name]);
}

/**
 * Match glob pattern and render files accordingly
 */
glob(templates, options.glob, function (err, files) {
    if (err) {
        return console.error(chalk.red(err));
    }

    /**
     * Collect json data files
     */
    collectFiles();

    /**
     * Collect yaml data loop function
     */
    collectAll(files);

    /**
     * Render pages loop function
     */
    renderAll(files, options.context, options.build);
});

/**
 * Collect json data files
 */
const oData = [];
function collectFiles() {
    for (let key in gc.templates.data) {
        oData[key] = JSON.parse(fs.readFileSync(gc.templates.data[key]));
    }
}


/**
 * Collect yaml data loop function
 * @param file
 * @param key
 */
function collectAll(files) {
    for (let i = 0; i < files.length; i++) {
        collect(files[i], 'nav');
    }
}

/**
 * Collect yaml data function
 * @param file
 * @param key
 */
function collect(file, key) {
    if(matter.read(options.source + '/' + file)['data'][key] !== undefined) {
        const pageData = matter.read(options.source + '/' + file)['data'][key][0];
        pageData['url'] = '/' + file.replace(/\.\w+$/, '') + '.html';

        oNav.push(pageData);
    }
}

/**
 * Render loop function
 * @param files
 * @param data
 * @param outputDir
 */
function renderAll(files, data, outputDir) {
    for (let i = 0; i < files.length; i++) {
        render(files[i], data, outputDir);
    }
}

/**
 * Render page function
 * @param file
 * @param data
 * @param outputDir
 */
function render(file, data, outputDir) {
    log(chalk.green(`[templates]: render => ${file}`));
    console.time(chalk.green(`[templates]: ${file} finished in`));

    if (path.extname(file) === '.html') {
        return console.error(chalk.red('To avoid overwriting your templates, do not use html as file extension'));
    }

    /**
     * Inject YAML data
     * @type {Object}
     */
    let context = {
        page: matter.read(options.source + '/' + file)['data'],
        path: gc.path,
        info: gc.info,
        nav: oNav
    };

    /**
     * Override context var, concat context and oData object
     * @type {*}
     */
    context = Object.assign({}, context, oData);

    env.render(file, context, function (err, res) {
        if (err) return console.error(chalk.red(err));

        let outputFile = file.replace(/\.\w+$/, '') + '.html';

        if (outputDir) {
            outputFile = path.resolve(outputDir, outputFile);
            mkdirp.sync(path.dirname(outputFile));
        }

        fs.writeFileSync(outputFile, res);
        console.timeEnd(chalk.green(`[templates]: ${file} finished in`));
    });
}
