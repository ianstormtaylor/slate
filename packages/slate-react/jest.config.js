const config = {
  testMatch: ['<rootDir>/test/**/*.{js,ts,tsx,jsx}'],
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.json',
    },
  },
  testEnvironment: 'jsdom',
}

module.exports = config
