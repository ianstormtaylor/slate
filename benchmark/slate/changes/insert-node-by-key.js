/** @jsx h */
/* eslint-disable react/jsx-key */

const h = require('../../helpers/h')

module.exports.default = function(change) {
  change
    .insertNodeByKey('a0', 0, <paragraph>Hello world</paragraph>)
    .insertNodeByKey('a1', 1, <paragraph>Hello world</paragraph>)
    .insertNodeByKey('a2', 2, <paragraph>Hello world</paragraph>)
    .insertNodeByKey('a3', 3, <paragraph>Hello world</paragraph>)
    .insertNodeByKey('a4', 4, <paragraph>Hello world</paragraph>)
}

const value = (
  <value>
    <document>
      {Array.from(Array(10)).map((v, i) => (
        <quote key={`a${i}`}>
          <paragraph>
            This is editable <b>rich</b> text, <i>much</i> better than a
            textarea!
            {i == 0 ? <cursor /> : ''}
          </paragraph>
        </quote>
      ))}
    </document>
  </value>
)

module.exports.input = function() {
  return value.change()
}
