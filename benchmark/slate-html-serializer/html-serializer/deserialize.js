/** @jsx h */
/* eslint-disable react/jsx-key */

const Html = require('slate-html-serializer').default
const { JSDOM } = require('jsdom') // eslint-disable-line import/no-extraneous-dependencies

const html = new Html({
  parseHtml: JSDOM.fragment,
  rules: [
    {
      deserialize(el, next) {
        switch (el.tagName.toLowerCase()) {
          case 'blockquote':
            return {
              object: 'block',
              type: 'quote',
              nodes: next(el.childNodes),
            }
          case 'p': {
            return {
              object: 'block',
              type: 'paragraph',
              nodes: next(el.childNodes),
            }
          }
          case 'strong': {
            return {
              object: 'mark',
              type: 'bold',
              nodes: next(el.childNodes),
            }
          }
          case 'em': {
            return {
              object: 'mark',
              type: 'italic',
              nodes: next(el.childNodes),
            }
          }
        }
      },
    },
  ],
})

module.exports.default = function(string) {
  html.deserialize(string)
}

module.exports.input = `
  <blockquote>
    <p>
      This is editable <strong>rich</strong> text, <em>much</em> better than a textarea!
    </p>
  </blockquote>
`
  .trim()
  .repeat(10)
