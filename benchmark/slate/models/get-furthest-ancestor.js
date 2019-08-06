/** @jsx h */
/* eslint-disable react/jsx-key */

const h = require('../../helpers/h')

module.exports.default = function(document) {
  document.getFurthestChild('T1')
  document.getFurthestChild('T2')
  document.getFurthestChild('T3')
  document.getFurthestChild('T4')
  document.getFurthestChild('T5')
}

const value = (
  <value>
    <document>
      {Array.from(Array(10)).map((_, i) => (
        <quote>
          <paragraph>
            <paragraph>
              <text key={`T${i}`}>
                This is editable rich text, much better than a textarea!
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
