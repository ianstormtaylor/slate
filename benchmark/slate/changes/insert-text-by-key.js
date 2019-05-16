/** @jsx h */
/* eslint-disable react/jsx-key */

const h = require('../../helpers/h')
const { Editor } = require('slate')

module.exports.default = function(editor) {
  editor
    .insertTextByKey('T1', 0, 'one')
    .insertTextByKey('T2', 5, 'two')
    .insertTextByKey('T3', 10, 'three')
    .insertTextByKey('T4', 15, 'four')
    .insertTextByKey('T5', 20, 'five')
}

const value = (
  <value>
    <document>
      {Array.from(Array(10)).map((v, i) => (
        <quote>
          <paragraph>
            <paragraph>
              <text key={`T${i}`}>
                This is editable rich text, much better than a textarea!
                {i === 0 ? <cursor /> : null}
              </text>
            </paragraph>
          </paragraph>
        </quote>
      ))}
    </document>
  </value>
)
// const text = value.document.getLastText()

module.exports.input = () => {
  return new Editor({ value })
}
