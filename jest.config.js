module.exports = {
    rootDir: '.',
    moduleDirectories: ['node_modules', 'src'],
    preset: 'ts-jest',
    testMatch: ['<rootDir>/test/**/*test.ts'],
    // collectCoverage: true,
    // collectCoverageFrom: [ './src/**/*.{js,ts}' ],
    // coverageDirectory: './coverage',
    coverageThreshold: {
        global: {
            branches: 0,
            functions: 0,
            lines: 0,
            statements: 0
        }
    }
};
