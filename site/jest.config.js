const config = {
  testMatch: ['<rootDir>/examples/**/*.test.{js,ts,tsx,jsx}'],
  preset: 'ts-jest/presets/js-with-ts',
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.test.json',
    },
  },
  testEnvironment: 'jest-environment-jsdom',
}

module.exports = config
