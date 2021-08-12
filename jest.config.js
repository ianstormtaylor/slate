module.exports = {
  preset: 'ts-jest',
  testRegex: '(/packages/slate-react/test/.*|(\\.|/)(test))\\.js?$',
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    "^.+\\.(js|jsx)$": "babel-jest",
  }
};
