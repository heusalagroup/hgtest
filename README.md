# heusalagroup/hgtest

This project is extremely simple unit test runner for [NodeJS](https://nodejs.org).

 * It can run tests written in JavaScript (or TypeScript)
 * It's less than 200 lines of code
 * It has zero runtime dependencies -- and only three (3!) development dependencies, NodeJS included
 * It does not need configuring
 * It runs on *NodeJS v14 LTS* and newer (but maybe older too)

### Background

It was made from the frustration of setting up Mocha & etc for a new project, which also bring your project extra 109 packages 
as a dependency, and often this needless effort is the only reason why my project doesn't have unit tests and takes a 
lot of disk space (not to mention security issues and the work needed to audit that).

It took me less than two hours of work and one can of [Nocco](https://nocco.com) to implement it -- which is much less 
than setting up fully working Mocha setup.

### What it is not

It doesn't include any asserting library, spies, fakes, or anything like that, since *it's not the job for a test runner*. 

I suggest using [SinonJS](https://sinonjs.org/) for writing tests, but you may even use
 [Node's assert module](https://nodejs.org/api/assert.html).

### Example test

If you're testing `DlInstance` class, create a file named `DlInstanceTest` and write your tests as static functions:

```
import AssertUtils from "./AssertUtils";

export class DlInstanceTest {

    public static firstTest () {

        AssertUtils.equals(1, 2);

    }

}
```

### How to install

You can install it using NPM:

```
npm i -D @heusalagroup/hgtest
```

If you want the latest non-stable version directly from our Github:

```
npm i -D heusalagroup/hgtest
```

### How to run your tests

You'll need to tell `hgtest` where to look for compiled JavaScript test files. 

These are any files named `*Test.js`.

If you use a build system like TypeScript, then direct the test runner to look files from the `./dist` folder.

```
$ hgtest ./dist
1 (of 1) tests failed:

[/Users/jhh/git/heusalagroup/dldb/dist/DlInstanceTest.js] DlInstanceTest.firstTest failed:  TypeError: Values were not equal: 1 !== 2
    at Function.AssertUtils.equals (/Users/jhh/git/heusalagroup/dldb/dist/AssertUtils.js:9:19)
    at Function.DlInstanceTest.firstTest (/Users/jhh/git/heusalagroup/dldb/dist/DlInstanceTest.js:9:34)
    at /Users/jhh/git/heusalagroup/dldb/dist/test.js:46:59
    at Array.forEach (<anonymous>)
    at /Users/jhh/git/heusalagroup/dldb/dist/test.js:30:33
    at Array.forEach (<anonymous>)
    at TestRunner.testFile (/Users/jhh/git/heusalagroup/dldb/dist/test.js:26:23)
    at Array.forEach (<anonymous>)
    at Function.TestRunner.testDirectory (/Users/jhh/git/heusalagroup/dldb/dist/test.js:63:29)
    at Object.<anonymous> (/Users/jhh/git/heusalagroup/dldb/dist/test.js:111:12) 

```

### Example integration with package.json

You can add your scripts section to include `"test": "hgtest ./dist"`.
 
Then you may use `npm test` to test your code:

```
$ npm test

> dldb@0.4.0 test /Users/jhh/git/heusalagroup/dldb
> hgtest ./dist

ERROR: 1 (of 1) tests failed:

[/Users/jhh/git/heusalagroup/dldb/dist/DlInstanceTest.js] DlInstanceTest.firstTest failed:  TypeError: Values were not equal: 1 !== 2
    at Function.AssertUtils.equals (/Users/jhh/git/heusalagroup/dldb/dist/AssertUtils.js:9:19)
    at Function.DlInstanceTest.firstTest (/Users/jhh/git/heusalagroup/dldb/dist/DlInstanceTest.js:9:34)
    at /Users/jhh/git/heusalagroup/hgtest/dist/SSTestRunner.js:48:59
    at Array.forEach (<anonymous>)
    at /Users/jhh/git/heusalagroup/hgtest/dist/SSTestRunner.js:32:33
    at Array.forEach (<anonymous>)
    at TestRunner.testFileInDir (/Users/jhh/git/heusalagroup/hgtest/dist/SSTestRunner.js:28:23)
    at Array.forEach (<anonymous>)
    at Function.TestRunner.testDirectory (/Users/jhh/git/heusalagroup/hgtest/dist/SSTestRunner.js:68:29)
    at /Users/jhh/git/heusalagroup/hgtest/dist/hgtest.js:24:64 

npm ERR! Test failed.  See above for more details.
```

