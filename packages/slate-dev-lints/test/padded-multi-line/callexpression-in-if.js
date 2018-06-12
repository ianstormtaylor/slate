import rule from '../../src/rules/padded-multilines'

const invalidCode = `
function test(a) {
  let b = a
  if ( a.find(x => {
    if (x.checked) return true;
    const {actual, expected} =x;
    return actual === expected
  })) {
    b += 1
    return b
  }
  return a
}
`

const validCode = `
function test(a) {
  let b = a

  if ( a.isPassed &&
       !a.isNotPassed &&
    a.find(x => {
    if (x.checked) return true;
    const {actual, expected} =x;
    return actual === expected
  })) {
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
