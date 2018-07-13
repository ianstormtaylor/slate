/** @jsx h */

import h from '../helpers/h'

export const input = (
  <value>
    <document order={[3, 2, 1]} article>
      <quote big>
        <paragraph>
          <i very>hi</i>
          <link src="over there">
            <i>
              <b>o</b>n
            </i>e
          </link>
        </paragraph>
        <paragraph>
          <link>two</link>
        </paragraph>
        <paragraph>
          <emoji nice />
        </paragraph>
      </quote>
    </document>
  </value>
)
// console.log(JSON.stringify(input.toJS(), null, 2))
export const output = [
  'slt1',
  1,
  [
    2,
    'quote',
    { big: true },
    [
      2,
      'paragraph',
      [[['italic', { very: true }], 'hi']],
      [
        3,
        'link',
        { src: 'over there' },
        [['bold', 'italic', 'o'], ['italic', 'n'], 'e'],
      ],
    ],
    [2, 'paragraph', [3, 'link', 'two']],
    [2, 'paragraph', [3, 'emoji', { nice: true }, 5]],
  ],
]
