
export default {
  rules: [
    {
      deserialize(el, next) {
        switch (el.tagName) {
          case 'p': {
            return {
              kind: 'block',
              type: 'paragraph',
              nodes: next(el.children)
            }
          }
          case 'a': {
            return {
              kind: 'inline',
              type: 'link',
              nodes: next(el.children),
              data: {
                href: el.attribs.href
              }
            }
          }
        }
      }
    }
  ]
}
