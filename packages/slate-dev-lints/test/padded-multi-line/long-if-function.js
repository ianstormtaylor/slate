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

export default function(ruleTester, name) {
  ruleTester.run(name, rule, {
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
