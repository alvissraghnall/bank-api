const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig");
const { join } = require("path");

function manageKey (key) {
    return key.includes('(.*)') ? key.slice(0, -1) + '\\.js$' : key;
}

function manageMapper(mapper) {
    const newMapper =  {};
    for (const key in mapper) {
        newMapper[manageKey(key)] = mapper[key];

    }
    newMapper['^\.\/(.*)\\.ts$'] = '$1';
    return newMapper;
}

function makeMapper (srcPath) {
    const aliases = {};
    const paths = compilerOptions.paths;

    Object.keys(paths).forEach(item => {
        const key = item.replace("/*", "/(.*)");
        const path = paths[item][0].replace('/*', '/$1');
        aliases[key] = srcPath + '/' + path;
    });
    return aliases;
}

module.exports = {
    moduleFileExtensions: [
        "js",
        "json",
        "ts"
    ],
    rootDir: "./",
    testRegex: ".*\\.spec\\.ts$",
    // testRegex: ".service\\.spec\\.ts$",
    transform: {
        "^.+\\.ts$": "ts-jest"
    },
    transformIgnorePatterns: ['^.+\\.js$'],
    collectCoverageFrom: [
        "**/*.(t|j)s"
    ],
    coverageDirectory: "../coverage",
    preset: 'ts-jest',
    testEnvironment: 'node',
    modulePaths: [compilerOptions.baseUrl],
    roots: ['<rootDir>'],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: join('<rootDir>', compilerOptions.baseUrl) }),

}

/**
 * "jest": {
    "moduleFileExtensions": [
      "js",
      "json",
      "ts"
    ],
    "rootDir": "src",
    "testRegex": ".*\\.spec\\.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": [
      "**\/*.(t|j)s"
    ],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  }
 */