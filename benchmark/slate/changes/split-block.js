/** @jsx h */
/* eslint-disable react/jsx-key */

const h = require('../../helpers/h')

module.exports.default = function(change) {
  change
    .splitBlock()
    .moveForward(5)
    .splitBlock()
    .moveForward(5)
    .splitBlock()
    .moveForward(5)
    .splitBlock()
    .moveForward(5)
    .splitBlock()
}

const value = (
  <value>
    <document>
      {Array.from(Array(10)).map((v, i) => (
        <quote>
          <paragraph>
            <paragraph>
              This
              {i == 0 ? <cursor /> : ''}
              is editable <b>rich</b> text, <i>much</i> better than a textarea!
            </paragraph>
          </paragraph>
        </quote>
      ))}
    </document>
  </value>
)

module.exports.input = function() {
  return value.change()
}
