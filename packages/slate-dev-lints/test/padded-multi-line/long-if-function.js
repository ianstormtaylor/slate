import rule from '../../src/rules/padded-multi-lines'

const invalidCode = `
function test(a) {
  let b = a
  if (typeof a !== 'number') {
    b += 1
    return b
  }
  return a
}
`

const validCode = `
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

export const input = 'padded-multi-lines'

export default function(ruleName) {
  ruleTester.run(ruleName, rule, {
    valid: [
      {
        code: validCode,
      },
    ],
    invalid: [
      {
        code: invalidCode,
        errors: [
          {
            message: 'Missing blank line before a multi-lines block',
          },
        ],
      },
    ],
  })
}
