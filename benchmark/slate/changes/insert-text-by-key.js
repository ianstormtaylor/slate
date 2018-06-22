/** @jsx h */
/* eslint-disable react/jsx-key */

const h = require('../../helpers/h')

module.exports.default = function({ change, text }) {
  change.insertTextByKey(text.key, 0, 'a')
}

module.exports.input = function() {
  const value = (
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
  )

  const change = value.change()
  const text = value.document.getLastText()
  return { change, text }
}
