# sendanor/sstest

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
npm i -D @sendanor/sstest
```

If you want the latest non-stable version directly from our Github:

```
npm i -D sendanor/sstest
```

### How to run your tests

You'll need to tell `sstest` where to look for compiled JavaScript test files. 

These are any files named `*Test.js`.

If you use a build system like TypeScript, then direct the test runner to look files from the `./dist` folder.

```
sstest ./dist
```

### Example integration with package.json

You can add your scripts section to include `"test": "sstest ./dist"`.
 
Then you may then use `npm test` to test your files.

