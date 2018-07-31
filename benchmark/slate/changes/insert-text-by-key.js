/** @jsx h */
/* eslint-disable react/jsx-key */

const h = require('../../helpers/h')

module.exports.default = function({ change, text }) {
  change
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
                This is editable <b>rich</b> text, <i>much</i> better than a
                textarea!
                {i == 0 ? <cursor /> : ''}
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
  const change = value.change()
  return { change, text }
}
