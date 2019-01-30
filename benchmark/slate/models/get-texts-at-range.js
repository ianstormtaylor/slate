/** @jsx h */
/* eslint-disable react/jsx-key */

const h = require('../../helpers/h')
const { Editor } = require('slate')

module.exports.default = function(value) {
  value.document.getTextsAtRange(value.selection)
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

const editor = new Editor({ value })
editor.moveToRangeOfDocument()
value = editor.value

module.exports.input = function() {
  return value
}
