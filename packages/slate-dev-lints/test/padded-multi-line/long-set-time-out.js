import rule from '../../src/rules/padded-multilines'

const invalidCode = `
function test(a) {
  let b = a+100
  setTimeout(() => {
    console.log(b)
  }, 1000)
  return a
}
`

const validCode = `
function test(a) {
  let b = a+100

  setTimeout(() => {
    console.log(b)
  }, 1000)

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
            messageId: 'before',
          },
          {
            messageId: 'after',
          },
        ],
      },
    ],
  })
}
