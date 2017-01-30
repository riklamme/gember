#! /usr/bin/env node

const gc = require('../gember.config');
const browserSync = require('browser-sync').create();
const htmlInjector = require('bs-html-injector');

browserSync.use(htmlInjector, {
    "files": ["build/*.html"],
});

browserSync.init({
    "files": ["build/resources/**/*"],
    "server": "build",
    "directory": true,
    "open": false
});
