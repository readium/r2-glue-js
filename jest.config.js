module.exports = {
  globals: {
    'ts-jest': {
      diagnostics: false,
    },
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  preset: 'ts-jest',
  testMatch: null,
};
