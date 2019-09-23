module.exports = {
    "transform": {
        '.*\\.(ts)$': 'ts-jest'
    },
    "globals": {
        "ts-jest": {
            "diagnostics": false
        }
    },
    "transformIgnorePatterns": [
        "<rootDir>/node_modules/"
    ],
    "modulePaths": [
        "<rootDir>/libs"
    ],
    "moduleNameMapper": {
        "^#test/(.*)$": "<rootDir>/test/$1",
        "^#(.*)$": "<rootDir>/src/app/$1"
    },
    "runner": "jest-runner",
    "testEnvironment": "node",
    "testRegex": "(/__tests__/.*|(\\.|/)(spec))\\.ts$",
    "moduleFileExtensions": [
        "ts",
        "tsx",
        "js"
    ],
    "restoreMocks": true
};