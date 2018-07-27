/** @jsx h */
/* eslint-disable react/jsx-key */

const h = require('../../helpers/h')

module.exports.default = function(change) {
  change
    .insertNodeByKey('a', 0, <paragraph>Hello world</paragraph>)
    .insertNodeByKey('a', 1, <paragraph>Hello world</paragraph>)
    .insertNodeByKey('a', 2, <paragraph>Hello world</paragraph>)
    .insertNodeByKey('a', 3, <paragraph>Hello world</paragraph>)
    .insertNodeByKey('a', 4, <paragraph>Hello world</paragraph>)
}

const value = (
  <value>
    <document>
      {Array.from(Array(10)).map((v, i) => (
        <quote key="a">
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
