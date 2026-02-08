export default {
  testEnvironment: 'node',
  transform: {},
  testMatch: ['**/__tests__/**/*.test.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/v1/__tests__/**'
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/config/'
  ],
  testTimeout: 10000,
  verbose: true
};
