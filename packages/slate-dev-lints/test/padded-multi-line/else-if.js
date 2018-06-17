import rule from '../../src/rules/padded-multilines'

const validCodeNaked = `
if (a ===1) {
  b =1
} else if (a === 2) {
  b= 2
}
`

const validCode = `
function test(a){
if (a ===1) {
  b =1
} else if (a === 2) {
  b= 2
}
}

`

export default function(ruleTester, name) {
  ruleTester.run(name, rule, {
    valid: [
      {
        code: validCode,
      },
      { code: validCodeNaked },
    ],
    invalid: [],
  })
}
