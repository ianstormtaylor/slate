/** @jsx h */
/* eslint-disable react/jsx-key */

const h = require('../../helpers/h')
const { Editor } = require('slate')

module.exports.default = function(editor) {
  editor.normalize().normalize()
}

const value = (
  <value>
    <document>
      {Array.from(Array(10)).map((v, i) => (
        <quote>
          <paragraph>
            <paragraph>
              <text />
              <link>link text</link>
              <text />
            </paragraph>
            <paragraph />
            <paragraph>
              <paragraph>
                <text />
                <link>link text</link>
                <text />
                <text> more text after</text>
                <text />
              </paragraph>
            </paragraph>
          </paragraph>
        </quote>
      ))}
    </document>
  </value>
)

module.exports.input = function() {
  return new Editor({ value }, { normalize: false })
}
