import { Node, Scrubber } from 'slate'

export const input = {
  customField: 'some very long custom field value that will get scrubbed',
  anotherField: 'this field should not get scrambled',
}

export const test = (value: Node) => {
  Scrubber.setScrubber((key, value) =>
    key === 'customField' ? '... scrubbed ...' : value
  )
  const stringified = Scrubber.stringify(value)
  Scrubber.setScrubber(undefined)

  const unmarshaled = JSON.parse(stringified)
  return (
    // ensure that first field has been scrubbed
    unmarshaled.customField === '... scrubbed ...' &&
    // ensure that second field is unaltered
    unmarshaled.anotherField === input.anotherField
  )
}

export const output = true
