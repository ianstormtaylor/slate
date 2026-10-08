import React from 'react'
import { Editable } from '../src'

type EditableProps = React.ComponentProps<typeof Editable>

type TextareaOnlyProp = 'rows' | 'cols' | 'maxLength' | 'wrap' | 'value'

const acceptsTextareaOnlyProps: Extract<
  keyof EditableProps,
  TextareaOnlyProp
> extends never
  ? false
  : true = false

const acceptsAutoFocus: 'autoFocus' extends keyof EditableProps ? true : false =
  true

describe('EditableProps', () => {
  it('takes div attributes, not textarea-only ones', () => {
    expect(acceptsTextareaOnlyProps).toBe(false)
    expect(acceptsAutoFocus).toBe(true)
  })
})
