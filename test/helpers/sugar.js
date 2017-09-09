
import createHyperscript from './slate-sugar'

/**
 * Define a hyperscript.
 *
 * @type {Function}
 */

const sugar = createHyperscript({
  blocks: {
    paragraph: 'paragraph',
    quote: 'quote',
  },
  inlines: {
    link: 'link',
    hashtag: 'hashtag',
  },
  marks: {
    b: 'bold',
    i: 'italic',
    u: 'underline',
  },
  voids: {
    image: 'image',
    emoji: 'emoji',
  },
}, {
  voids(tagName, attributes) {
    switch (tagName) {
      case 'image':
        return {
          kind: 'block',
          type: tagName,
          data: attributes,
          isVoid: true,
        }
      case 'emoji':
        return {
          kind: 'inline',
          type: tagName,
          data: attributes,
          isVoid: true,
        }
    }
  }
})

/**
 * Export.
 *
 * @type {Function}
 */

export default sugar
