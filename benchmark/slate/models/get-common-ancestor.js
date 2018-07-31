/** @jsx h */
/* eslint-disable react/jsx-key */

const h = require('../../helpers/h')

module.exports.default = function(document) {
  document.getCommonAncestor('T1', 'T2')
  document.getCommonAncestor('T2', 'T3')
  document.getCommonAncestor('T3', 'T4')
  document.getCommonAncestor('T4', 'T5')
  document.getCommonAncestor('T5', 'T6')
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
