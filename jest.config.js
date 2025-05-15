const config = {
  testMatch: ['<rootDir>/packages/slate-react/test/**/*.{js,ts,tsx,jsx}'],
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/packages/slate-react/tsconfig.json',
      },
    ],
  },
  testEnvironment: 'jsdom',
  collectCoverage: true,
  collectCoverageFrom: ['./packages/slate-react/src/chunking/*'],
  coverageThreshold: {
    './packages/slate-react/src/chunking/*': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
}

module.exports = config
