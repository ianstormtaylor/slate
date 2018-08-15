import { createHyperscript } from 'slate-hyperscript'

const h = createHyperscript({
  blocks: {
    line: 'line',
    paragraph: 'paragraph',
    quote: 'quote',
    code: 'code',
    list: 'list',
    item: 'item',
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
    fontSize: 'font-size',
  },
  decorations: {
    highlight: 'highlight',
  },
})

export default h
