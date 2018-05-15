import { createHyperscript } from 'slate-hyperscript'

/**
 * Define a hyperscript.
 *
 * @type {Function}
 */

const h = createHyperscript({
  blocks: {
    line: 'line',
    paragraph: 'paragraph',
    quote: 'quote',
    code: 'code',
    image: {
      type: 'image',
      isVoid: true,
    },
  },
  inlines: {
    link: 'link',
    hashtag: 'hashtag',
    comment: 'comment',
    emoji: {
      type: 'emoji',
      isVoid: true,
    },
  },
  marks: {
    b: 'bold',
    i: 'italic',
    u: 'underline',
  },
})

/**
 * Export.
 *
 * @type {Function}
 */

export default h
