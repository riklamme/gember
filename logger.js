"use strict";

const logger = require("tfunk").Compiler({
    'info': function(string) {
        let s = stringSplit(string);
        return console.log(this.compile(`{blue:[}{green:${s[0].substring(1)}{blue:]} {cyan:[info]} {grey:${s[1]}`));
    },
    'ready': function(string) {
        let s = stringSplit(string);
        return console.log(this.compile(`{blue:[}{green:${s[0].substring(1)}{blue:]} {green:[ready]} {grey:${s[1]}`));
    },
    'start': function(string) {
        let s = stringSplit(string);
        return console.log(this.compile(`{blue:[}{green:${s[0].substring(1)}{blue:]} {green:[start]} {grey:${s[1]}`));
    },
    'finished': function(string) {
        let s = stringSplit(string);
        return console.log(this.compile(`{blue:[}{green:${s[0].substring(1)}{blue:]} {green:[finished]} {grey:${s[1]}`));
    },
    'change': function(string) {
        let s = stringSplit(string);
        return console.log(this.compile(`{blue:[}{green:${s[0].substring(1)}{blue:]} {yellow:[change]}{grey: =>} {white:${s[1]}`));
    },
    'run': function(string) {
        let s = stringSplit(string);
        return console.log(this.compile(`{blue:[}{green:${s[0].substring(1)}{blue:]} {blue:[run]}{grey: =>} {white:${s[1]}`));
    },
    'add': function(string) {
        let s = stringSplit(string);
        return console.log(this.compile(`{blue:[}{green:${s[0].substring(1)}{blue:]} {magenta:[add]}{grey: =>} {white:${s[1]}`));
    },
    'debug': function(string) {
        let s = stringSplit(string);
        return console.log(this.compile(`{blue:[}{green:${s[0].substring(1)}{blue:]} {yellow:[debug]} {white:${s[1]}`));
    },
    'warn': function(string) {
        let s = stringSplit(string);
        return console.log(this.compile(`{blue:[}{green:${s[0].substring(1)}{blue:]} {magenta:[warning]} {white:${s[1]}`));
    },
    'error': function(string) {
        let s = stringSplit(string);
        return console.log(this.compile(`{blue:[}{green:${s[0].substring(1)}{blue:]} {red:[error]} {white:${s[1]}`));
    }
});

function stringSplit(string) {
    return string.split(', ');
}
//
// logger.compile("{warn: styles:build, There are warnings in your syntax...");
//
// logger.compile("{error: styles:build, Could not write file to build folder...");
//
// logger.compile("{info: styles:build, Read file...");
//
// logger.compile("{debug: styles:build, debugger used to read value");

module.exports = logger;