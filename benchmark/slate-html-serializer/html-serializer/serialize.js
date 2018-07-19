/** @jsx h */
/* eslint-disable react/jsx-key */

const Html = require('slate-html-serializer').default
const React = require('react')
const h = require('../../helpers/h')
const { JSDOM } = require('jsdom') // eslint-disable-line import/no-extraneous-dependencies

const html = new Html({
  parseHtml: JSDOM.fragment,
  rules: [
    {
      serialize(obj, children) {
        switch (obj.object) {
          case 'block': {
            switch (obj.type) {
              case 'paragraph':
                return React.createElement('p', {}, children)
              case 'quote':
                return React.createElement('blockquote', {}, children)
            }
          }
          case 'mark': {
            switch (obj.type) {
              case 'bold':
                return React.createElement('strong', {}, children)
              case 'italic':
                return React.createElement('em', {}, children)
            }
          }
        }
      },
    },
  ],
})

module.exports.default = function(state) {
  html.serialize(state)
}

module.exports.input = (
  <value>
    <document>
      {Array.from(Array(10)).map(() => (
        <quote>
          <paragraph>
            This is editable <b>rich</b> text, <i>much</i> better than a
            textarea!
          </paragraph>
        </quote>
      ))}
    </document>
  </value>
)
