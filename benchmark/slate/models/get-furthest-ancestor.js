/** @jsx h */
/* eslint-disable react/jsx-key */

const h = require('../../helpers/h')

module.exports.default = function(document) {
  document.getFurthestAncestor('T1')
  document.getFurthestAncestor('T2')
  document.getFurthestAncestor('T3')
  document.getFurthestAncestor('T4')
  document.getFurthestAncestor('T5')
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
