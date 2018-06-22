/** @jsx h */
/* eslint-disable react/jsx-key */

const h = require('../../helpers/h')

export default function({ value, text }) {
  value.document.getParent(text.key)
}

const value = (
  <value>
    <document>
      {Array.from(Array(10)).map(() => (
        <quote>
          <paragraph>
            <paragraph>
              This is editable <b>rich</b> text, <i>much</i> better than a
              textarea!
            </paragraph>
          </paragraph>
        </quote>
      ))}
    </document>
  </value>
)
const text = value.document.getLastText()
export const input = () => {
  return { value, text }
}
