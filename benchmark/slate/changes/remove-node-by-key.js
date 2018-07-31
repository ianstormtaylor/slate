/** @jsx h */
/* eslint-disable react/jsx-key */

const h = require('../../helpers/h')

module.exports.default = function({ change, text }) {
  change
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
                {i == 0 ? <cursor /> : ''}
                This is editable <b>rich</b> text, <i>much</i> better than a
                textarea!
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
