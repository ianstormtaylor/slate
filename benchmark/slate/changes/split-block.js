/** @jsx h */
/* eslint-disable react/jsx-key */

const h = require('../../helpers/h')

module.exports.default = function(change) {
  change.splitBlock()
}

module.exports.input = function() {
  return (
    <value>
      <document>
        {Array.from(Array(10)).map((v, i) => (
          <quote>
            <paragraph>
              <paragraph>
                This is editable <b>rich</b> text, <i>much</i> better than a
                textarea!
                {i == 0 ? <cursor /> : ''}
              </paragraph>
            </paragraph>
          </quote>
        ))}
      </document>
    </value>
  ).change()
}
