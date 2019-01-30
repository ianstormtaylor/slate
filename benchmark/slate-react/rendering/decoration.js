/** @jsx h */
/* eslint-disable react/jsx-key */

const React = require('react')
const ReactDOM = require('react-dom/server')
const h = require('../../helpers/h')
const { Editor } = require('slate')
const { Editor: EditorComponent } = require('slate-react')

module.exports.default = function(value) {
  const el = React.createElement(EditorComponent, { value })
  ReactDOM.renderToStaticMarkup(el)
}

let value = (
  <value>
    <document>
      {Array.from(Array(10)).map(() => (
        <quote>
          <paragraph>
            <paragraph>
              This is editable <b>rich</b> text, <i>much</i> better than a
              textarea!
            </paragraph>
          </paragraph>
        </quote>
      ))}
    </document>
  </value>
)

const texts = value.document.getTexts()
const decorations = texts.flatMap((t, index) => {
  if (index % 4 !== 0) return []
  if (t.length === 0) return []
  return [
    {
      anchor: {
        key: t.key,
        offset: 0,
      },
      focus: {
        key: t.key,
        offset: 1,
      },
      mark: {
        type: 'underline',
      },
    },
  ]
})

value = value.setProperties({ decorations })

const editor = new Editor({ value })

module.exports.input = editor.value
