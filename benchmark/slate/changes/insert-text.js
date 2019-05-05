/** @jsx h */
/* eslint-disable react/jsx-key */

const h = require('../../helpers/h')
const { Editor } = require('slate')

module.exports.default = function(editor) {
  editor
    .insertText('one')
    .moveForward(5)
    .insertText('two')
    .moveForward(5)
    .insertText('three')
    .moveForward(5)
    .insertText('four')
    .moveForward(5)
    .insertText('five')
}

const value = (
  <value>
    <document>
      {Array.from(Array(10)).map((v, i) => (
        <quote>
          <paragraph>
            <paragraph>
              {i === 0 ? <cursor /> : null}
              This is editable <b>rich</b> text, <i>much</i> better than a
              textarea!
            </paragraph>
          </paragraph>
        </quote>
      ))}
    </document>
  </value>
)

module.exports.input = () => {
  return new Editor({ value })
}
