/** @jsx h */
/* eslint-disable react/jsx-key */

const h = require('../../helpers/h')
const { Editor } = require('slate')

module.exports.default = function(editor) {
  editor
    .removeNodeByKey('T1')
    .removeNodeByKey('T2')
    .removeNodeByKey('T3')
    .removeNodeByKey('T4')
    .removeNodeByKey('T5')
}

const value = (
  <value>
    <document>
      {Array.from(Array(10)).map((v, i) => (
        <quote>
          <paragraph>
            <paragraph>
              <text key={`T${i}`}>
                {i === 0 ? <cursor /> : null}
                This is editable rich text, much better than a textarea!
              </text>
            </paragraph>
          </paragraph>
        </quote>
      ))}
    </document>
  </value>
)
const text = value.document.getLastText()

module.exports.input = function() {
  return new Editor({ value })
}
