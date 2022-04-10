import { createHyperscript } from 'slate-hyperscript'

export const jsx = createHyperscript({
  elements: {
    block: {},
    inline: { inline: true },
  },
})
