module.exports = {
    testEnvironment: 'jest-environment-jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    transform: {
        '\\.[jt]sx?$': ['babel-jest', { configFile: './babel.config.cjs' }],
    },
    extensionsToTreatAsEsm: ['.ts', '.tsx', '.jsx'],
    moduleNameMapper: {
        '\\.(css|scss)$': 'identity-obj-proxy',
    },
    verbose: true,
};
