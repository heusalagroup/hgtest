// Copyright (c) 2022. Heusala Group <info@heusalagroup.fi>. All rights reserved.

import { ProcessUtils } from "./fi/hg/core/ProcessUtils";

// Must be first import to define environment variables before anything else
ProcessUtils.initEnvFromDefaultFiles();

import {
    COMMAND_NAME,
    LOG_LEVEL
} from "./constants/runtime";

import { LogService } from "./fi/hg/core/LogService";
import { LogLevel } from "./fi/hg/core/types/LogLevel";

LogService.setLogLevel(LOG_LEVEL);

import { CommandExitStatus } from "./fi/hg/core/cmd/types/CommandExitStatus";
import { RequestClient } from "./fi/hg/core/RequestClient";
import { CommandArgumentUtils } from "./fi/hg/core/cmd/utils/CommandArgumentUtils";
import { ParsedCommandArgumentStatus } from "./fi/hg/core/cmd/types/ParsedCommandArgumentStatus";
import { Headers } from "./fi/hg/core/request/Headers";
import { BUILD_USAGE_URL, BUILD_WITH_FULL_USAGE } from "./constants/build";
import { TestRunner } from "./fi/hg/core/test/TestRunner";
import {
    resolve as pathResolve
} from "path";
import {
    existsSync,
    lstatSync
} from "fs";

const LOG = LogService.createLogger('main');

export async function main (
    args: string[] = []
) : Promise<CommandExitStatus> {

    try {

        Headers.setLogLevel(LogLevel.INFO);
        RequestClient.setLogLevel(LogLevel.INFO);

        LOG.debug(`Loglevel as ${LogService.getLogLevelString()}`);

        const {scriptName, parseStatus, exitStatus, errorString, freeArgs} = CommandArgumentUtils.parseArguments(COMMAND_NAME, args);

        if ( parseStatus === ParsedCommandArgumentStatus.HELP || parseStatus === ParsedCommandArgumentStatus.VERSION ) {
            console.log(getMainUsage(scriptName));
            return exitStatus;
        }

        if (errorString) {
            console.error(`ERROR: ${errorString}`);
            return exitStatus;
        }

        ProcessUtils.setupDestroyHandler( () => {
            LOG.debug('Stopping command from process utils event');
        }, (err : any) => {
            LOG.error('Error while shutting down the service: ', err);
        });

        const CURRENT_DIR = process.cwd();
        const ARGS = freeArgs;
        const testDirectories : string[] = [];
        const testFiles : string[] = [];
        ARGS.forEach((arg: string) : void => {
            const fullPath = pathResolve(CURRENT_DIR, arg);
            if (!existsSync(fullPath)) {
                throw TypeError('Argument is unsupported or not a file: ' + arg);
            }
            const stat = lstatSync(fullPath);
            if (stat.isDirectory()) {
                testDirectories.push(fullPath);
            } else {
                testFiles.push(fullPath);
            }
        });

        testDirectories.forEach((dir: string) => TestRunner.testDirectory(dir));
        testFiles.forEach((file: string) => TestRunner.testFile(file));

        TestRunner.printResults();

        return CommandExitStatus.OK;

    } catch (err) {
        LOG.error(`Fatal error: `, err);
        return CommandExitStatus.FATAL_ERROR;
    }

}

/**
 *
 * @param scriptName
 * @nosideeffects
 * @__PURE__
 */
export function getMainUsage (
    scriptName: string
): string {

    /* @__PURE__ */if ( /* @__PURE__ */BUILD_WITH_FULL_USAGE ) {

        return `USAGE: ${/* @__PURE__ */scriptName} [OPT(s)] ARG(1) [...ARG(N)]

  ORGANISATION-NAME command.
  
...and OPT is one of:

    -h --help          Print help
    -v --version       Print version
    --                 Disables option parsing

  Environment variables:

    LOG_LEVEL as one of:
    
      ALL
      DEBUG
      INFO
      WARN
      ERROR
      NONE
`;
    } else {
        return `USAGE: ${/* @__PURE__ */scriptName} ARG(1) [...ARG(N)]
See ${/* @__PURE__ */BUILD_USAGE_URL}
`;
    }
}
