import { createHyperscript } from 'slate-hyperscript'

export const jsx = createHyperscript({
  elements: {
    a: { type: 'a' },
    b: { type: 'b' },
    c: { type: 'c' },
  },
})
