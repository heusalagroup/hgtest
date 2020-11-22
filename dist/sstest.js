#!/usr/bin/env node
try {
    var PATH_1 = require('path');
    var FS_1 = require('fs');
    var SSTestRunner_1 = require("./SSTestRunner")["default"];
    var CURRENT_DIR_1 = process.cwd();
    var ARGS = process.argv.slice(2);
    var TEST_DIRS_1 = [];
    var TEST_FILES_1 = [];
    ARGS.forEach(function (arg) {
        var fullPath = PATH_1.resolve(CURRENT_DIR_1, arg);
        if (!FS_1.existsSync(fullPath)) {
            throw TypeError('Argument is unsupported or not a file: ' + arg);
        }
        var stat = FS_1.lstatSync(fullPath);
        if (stat.isDirectory()) {
            TEST_DIRS_1.push(fullPath);
        }
        else {
            TEST_FILES_1.push(fullPath);
        }
        return fullPath;
    });
    TEST_DIRS_1.forEach(function (dir) { return SSTestRunner_1.testDirectory(dir); });
    TEST_FILES_1.forEach(function (file) { return SSTestRunner_1.testFile(file); });
    SSTestRunner_1.printResults();
}
catch (err) {
    console.error('FATAL ERROR: ' + err);
    process.exit(2);
}
