import { createHyperscript } from 'slate-hyperscript'

const h = createHyperscript({
  elements: {
    a: { type: 'a' },
    b: { type: 'b' },
    c: { type: 'c' },
  },
})

export { h }
