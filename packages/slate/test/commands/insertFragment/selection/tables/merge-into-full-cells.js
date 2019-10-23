/** @jsx h */

import h from '../../../../helpers/h'

export const run = editor => {
  editor.insertFragment(

    <block>
      <block>
        <block>
          <block>New 1</block>
          <block>New 2</block>
        </block>
      </block>
    </block>

  )
}

export const input = (
  <value>

    <block>
      <block>
        <block>
          <block>
            {'Existing 1 '}
            <cursor />
          </block>
          <block>Existing 2</block>
        </block>
      </block>
    </block>

  </value>
)

// TODO: paste "Existing 2" before / after "New 2" in second cell?
export const output = (
  <value>

    <block>
      <block>
        <block>
          <block>Existing 1 New 1</block>
          <block>
            New 2<cursor />
          </block>
          <block>Existing 2</block>
        </block>
      </block>
    </block>

  </value>
)

export const skip = true
