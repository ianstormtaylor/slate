/** @jsx h */

import h from '../../helpers/h'
import { Mark } from '../../..'

export const state = (
  <state>
    <document>
      <paragraph>
        word
      </paragraph>
    </document>
  </state>
)

export const plugins = [
  {
    schema: {
      marks: {
        bold: {
          fontWeight: 'bold'
        }
      },
      rules: [{
        match() {
          return true
        },
        decorate(text, block) {
          let { characters } = text
          let second = characters.get(1)
          const mark = Mark.create({ type: 'bold' })
          const marks = second.marks.add(mark)
          second = second.merge({ marks })
          characters = characters.set(1, second)
          return characters
        },
      }]
    }
  }
]

export const output = `
<div data-slate-editor="true" contenteditable="true" role="textbox">
    <div style="position:relative;"><span><span>w</span><span><span style="font-weight:bold;">o</span></span><span>rd</span></span>
    </div>
</div>
`.trim()
