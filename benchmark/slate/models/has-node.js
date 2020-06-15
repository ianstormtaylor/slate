/** @jsx h */
/* eslint-disable react/jsx-key */

const h = require('../../helpers/h')

module.exports.default = function(document) {
  document.hasNode('T1')
  document.hasNode('T2')
  document.hasNode('T3')
  document.hasNode('T4')
  document.hasNode('T5')
}

const value = (
  <value>
    <document>
      {Array.from(Array(10)).map((_, i) => (
        <quote>
          <paragraph>
            <paragraph>
              <text key={`T${i}`}>
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

module.exports.input = function() {
  return value.document
}
