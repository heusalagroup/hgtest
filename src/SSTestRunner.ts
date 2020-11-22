const fs = require('fs');
const path = require('path');

export enum TestResultState {

    RUNNING,
    SUCCESS,
    FAILED

}

export interface TestResult {

    state: TestResultState;

    file: string;

    className: string;

    methodName: string;

    result?: any;

    promise?: Promise<any>;

}

class TestRunner {

    protected static _results : Array<TestResult> = [];

    public static testFileInDir (dir: string, file: string) {

        if (file.startsWith('.')) return;
        if (file === 'node_modules') return;

        const stat = fs.lstatSync(path.join(dir, file));
        const isDir = stat.isDirectory();

        if (isDir) {
            return TestRunner.testDirectory(path.join(dir, file));
        }

        if (file.endsWith('Test.js')) {

            const test = require(path.resolve(dir, file));

            const testNames = Object.keys(test).filter(file => file.endsWith('Test'));

            testNames.forEach(testName => {

                const testClassName   = testName;
                const testClass       = test[testClassName];
                const testMethodNames = Object.keys(testClass);

                testMethodNames.forEach(methodName => {

                    const testResult : TestResult = {
                        state: TestResultState.RUNNING,
                        file: path.resolve(dir, file),
                        className: testClassName,
                        methodName: methodName
                    };

                    function testSuccess () {
                        testResult.state = TestResultState.SUCCESS;
                    }

                    function testFailed (err) {
                        testResult.state = TestResultState.FAILED;
                        testResult.result = err;
                    }

                    TestRunner._results.push(testResult);

                    try {

                        const result = testClass[methodName]();

                        if (TestRunner.isPromise(result)) {
                            testResult.promise = result;
                            result.then(testSuccess, testFailed);
                        } else {
                            testSuccess();
                        }

                    } catch(err) {
                        testFailed(err);
                    }

                });

            });

        }

    }

    public static testFile (file : string) {

        TestRunner.testFileInDir( path.dirname(file), path.basename(file) );

    }

    public static testDirectory (dir : string) {

        fs.readdirSync(dir).forEach( TestRunner.testFileInDir.bind(undefined, dir) );

    }

    public static printResults () {

        let testCount = TestRunner._results.length;
        let runningCount = 0;
        let successCount = 0;
        let failedCount = 0;
        let errorResults : Array<TestResult> = []
        let promises : Array<Promise<any>> = [];

        TestRunner._results.forEach(result => {
            switch(result.state) {
                case TestResultState.RUNNING:
                    runningCount += 1;
                    promises.push(result.promise);
                    return;
                case TestResultState.SUCCESS:
                    successCount += 1;
                    return;
                case TestResultState.FAILED:
                    failedCount += 1;
                    errorResults.push(result);
                    return;

            }
        });

        if (promises.length) {

            // @ts-ignore
            Promise.allSettled(promises).then(TestRunner.printResults).catch(err => {
                console.error('ERROR: ', err);
            });

        } else {

            if (testCount === 0) {

                console.error(`ERROR: No tests found.`);

                process.exit(1);

            } else if (failedCount >= 1) {

                console.error(`ERROR: ${failedCount} (of ${testCount}) tests failed:\n`);

                errorResults.forEach( testResult => {
                    console.error(`[${testResult.file}] ${testResult.className}.${testResult.methodName} failed: `, testResult.result, '\n');
                });

                process.exit(1);

            } else {

                console.log(`All ${testCount} tests successfully executed.`);

            }

        }

    }

    public static isPromise (value: any) : value is Promise<any> {
        return !!(value.then && value.catch);
    }

}

export default TestRunner;
