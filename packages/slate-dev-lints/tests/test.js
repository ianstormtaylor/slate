const code = `
function test(a) {
  let b = a
  if (typeof a !== 'number') {
    b += 1
    return b
  }
  return a
}
`

const RuleTester = require('eslint').RuleTester

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
}
const ruleTester = new RuleTester({ parserOptions })

const rule = require('../src/rules/margin-blank-lines-for-multilines-block')

ruleTester.run('margin-lines', rule, {
  valid: [],
  invalid: [
    {
      code,
      errors: [
        {
          message: 'Missing blank line before a multi-lines block',
        },
      ],
    },
  ],
})
