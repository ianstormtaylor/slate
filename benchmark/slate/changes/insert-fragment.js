/** @jsx h */
/* eslint-disable react/jsx-key */

const h = require('../../helpers/h')
const { Editor } = require('slate')

const fragment = (
  <document>
    {Array.from(Array(10)).map((v, i) => (
      <quote key={`a${i}`}>
        <paragraph>
          This is editable <b>rich</b> text, <i>much</i> better than a
          textarea!
          {i == 0 ? <cursor /> : ''}
        </paragraph>
      </quote>
    ))}
  </document>
)

module.exports.default = function(editor) {
  editor.insertFragment(fragment)
}

const value = (
  <value>
    <document>
      <paragraph>Some initial text.<cursor /></paragraph>
    </document>
  </value>
)


module.exports.input = function() {
  return new Editor({ value })
}
