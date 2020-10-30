module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [ "**/test/*.[tj]s", ],
  globals: {
    // we must specify a custom tsconfig for tests because we need the typescript transform
    // to transform jsx into js rather than leaving it jsx such as the next build requires.  you
    // can see this setting in tsconfig.jest.json -> "jsx": "react"
    "ts-jest": {
      tsConfig: "tsconfig.jest.json",
      babelConfig: './config/babel/register.cjs'
    }
  },
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest',
  },
};