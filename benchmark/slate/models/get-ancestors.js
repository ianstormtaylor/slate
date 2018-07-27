/** @jsx h */
/* eslint-disable react/jsx-key */

const h = require('../../helpers/h')

module.exports.default = function(document) {
  document.getAncestors('T1')
  document.getAncestors('T2')
  document.getAncestors('T3')
  document.getAncestors('T4')
  document.getAncestors('T5')
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
