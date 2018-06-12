import rule from '../../src/rules/padded-multilines'

const invalidCode = `
function test(a) {
  let b = \`teaswdcw
  ceverv
  fwevr3f3
  fev3rf43f
  f34f3\`
  console.log(b)
  return a
}
`

const validCode = `
function test(a) {
  let b = \`teaswdcw
  ceverv
  fwevr3f3
  fev3rf43f
  f34f3\`

  console.log(b)
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
            messageId: 'after',
          },
        ],
      },
    ],
  })
}
