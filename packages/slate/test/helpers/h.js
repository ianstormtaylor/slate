import { createHyperscript } from 'slate-hyperscript'

const h = createHyperscript({
  blocks: {
    line: 'line',
    paragraph: 'paragraph',
    quote: 'quote',
    code: 'code',
    list: 'list',
    item: 'item',
    image: 'image',
    table: 'table',
    table_body: 'table_body',
    table_row: 'table_row',
    table_cell: 'table_cell',
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
    fontSize: 'font-size',
  },
  annotations: {
    result: 'result',
    highlight: 'highlight',
  },
  schema: {
    blocks: {
      image: {
        isVoid: true,
      },
    },
    inlines: {
      emoji: {
        isVoid: true,
      },
    },
    annotations: {
      result: {
        isAtomic: true,
      },
    },
  },
})

export default h
