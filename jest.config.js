const config = {
  testPathIgnorePatterns: ['<rootDir>/packages/slate-react/test/bun/'],
  testMatch: ['<rootDir>/packages/slate-react/test/**/*.{js,ts,tsx,jsx}'],
  moduleNameMapper: {
    '^slate$': '<rootDir>/packages/slate/src/index.ts',
    '^slate-dom$': '<rootDir>/packages/slate-dom/src/index.ts',
    '^slate-history$': '<rootDir>/packages/slate-history/src/index.ts',
    '^slate-hyperscript$': '<rootDir>/packages/slate-hyperscript/src/index.ts',
    '^slate-react$': '<rootDir>/packages/slate-react/src/index.ts',
  },
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/packages/slate-react/tsconfig.test.json',
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
