import { Element, Text, Value } from 'slate'

/**
 * Parse a plaintext string into a Slate `Value` object.
 *
 * By default, it will use `\n` as the delimiter, splitting each line into a
 * separate element node.
 *
 * Note: You can pass `elementProps` or `textProps` to merge default properties
 * into the resulting element or text nodes. For adding default marks to each
 * text node, use `textProps` with a `marks` property.
 */

export const parsePlaintext = (
  plaintext: string,
  options: {
    delimiter?: string
    elementProps?: Partial<Element>
    textProps?: Partial<Text>
  } = {}
): Value => {
  const { elementProps = {}, textProps = {}, delimiter = '\n' } = options

  return {
    selection: null,
    annotations: {},
    nodes: plaintext.split(delimiter).map(line => {
      return {
        ...elementProps,
        nodes: [
          {
            marks: [],
            ...textProps,
            text: line,
          },
        ],
      }
    }),
  }
}
