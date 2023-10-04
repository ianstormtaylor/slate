const config = {
  testMatch: ['<rootDir>/packages/slate-react/test/**/*.{js,ts,tsx,jsx}'],
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/packages/slate-react/tsconfig.json',
    },
  },
  testEnvironment: 'jsdom',
}

module.exports = config
