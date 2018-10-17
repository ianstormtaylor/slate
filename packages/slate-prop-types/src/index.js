import {
  Block,
  Change,
  Data,
  Document,
  Inline,
  Leaf,
  Mark,
  Node,
  Range,
  Value,
  Text,
} from 'slate'

/**
 * Create a prop type checker for Slate objects with `name` and `validate`.
 *
 * @param {String} name
 * @param {Function} validate
 * @return {Function}
 */

function create(name, validate) {
  function check(isRequired, props, propName, componentName, location) {
    const value = props[propName]
    if (value == null && !isRequired) return null
    if (value == null && isRequired)
      return new Error(
        `The ${location} \`${propName}\` is marked as required in \`${componentName}\`, but it was not supplied.`
      )
    if (validate(value)) return null
    return new Error(
      `Invalid ${location} \`${propName}\` supplied to \`${componentName}\`, expected a Slate \`${name}\` but received: ${value}`
    )
  }

  function propType(...args) {
    return check(false, ...args)
  }

  propType.isRequired = function(...args) {
    return check(true, ...args)
  }

  return propType
}

/**
 * Prop type checkers.
 *
 * @type {Object}
 */

const Types = {
  block: create('Block', v => Block.isBlock(v)),
  blocks: create('List<Block>', v => Block.isBlockList(v)),
  change: create('Change', v => Change.isChange(v)),
  data: create('Data', v => Data.isData(v)),
  document: create('Document', v => Document.isDocument(v)),
  inline: create('Inline', v => Inline.isInline(v)),
  inlines: create('Inline', v => Inline.isInlineList(v)),
  leaf: create('Leaf', v => Leaf.isLeaf(v)),
  leaves: create('List<Leaf>', v => Leaf.isLeafList(v)),
  mark: create('Mark', v => Mark.isMark(v)),
  marks: create('Set<Mark>', v => Mark.isMarkSet(v)),
  node: create('Node', v => Node.isNode(v)),
  nodes: create('List<Node>', v => Node.isNodeList(v)),
  range: create('Range', v => Range.isRange(v)),
  ranges: create('List<Range>', v => Range.isRangeList(v)),
  value: create('Value', v => Value.isValue(v)),
  text: create('Text', v => Text.isText(v)),
  texts: create('List<Text>', v => Text.isTextList(v)),
}

/**
 * Export.
 *
 * @type {Object}
 */

export default Types
