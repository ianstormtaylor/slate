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
    image: 'image',
    table: 'table',
    tbody: 'tbody',
    tr: 'tr',
    td: 'td',
    thead: 'thead',
    th: 'th',
  },
  inlines: {
    link: 'link',
    hashtag: 'hashtag',
    comment: 'comment',
    emoji: 'emoji',
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
