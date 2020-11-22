#!/usr/bin/env node
try {

    const PATH = require('path');
    const FS = require('fs');
    const SSTestRunner = require("./SSTestRunner").default;

    const CURRENT_DIR = process.cwd();

    const ARGS = process.argv.slice(2);

    const TEST_DIRS : Array<string> = [];
    const TEST_FILES : Array<string> = [];

    ARGS.forEach(arg => {

        const fullPath = PATH.resolve(CURRENT_DIR, arg);

        if (!FS.existsSync(fullPath)) {
            throw TypeError('Argument is unsupported or not a file: ' + arg);
        }

        const stat = FS.lstatSync(fullPath);

        if (stat.isDirectory()) {
            TEST_DIRS.push(fullPath);
        } else {
            TEST_FILES.push(fullPath);
        }

        return fullPath;

    });

    TEST_DIRS.forEach((dir: string) => SSTestRunner.testDirectory(dir));
    TEST_FILES.forEach((file: string) => SSTestRunner.testFile(file));

    SSTestRunner.printResults();

} catch(err) {

    console.error('FATAL ERROR: ' + err);

    process.exit(2);

}
