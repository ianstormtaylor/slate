

import Document from './document'
import Mark from './mark'
import Selection from './selection'
import Transform from './transform'
import uid from '../utils/uid'
import { Record, Set, Stack, List } from 'immutable'

/**
 * History.
 */

const History = new Record({
  undos: new Stack(),
  redos: new Stack()
})

/**
 * Default properties.
 */

const DEFAULTS = {
  document: new Document(),
  selection: new Selection(),
  history: new History(),
  isNative: false
}

/**
 * State.
 */

class State extends new Record(DEFAULTS) {

  /**
   * Create a new `State` with `properties`.
   *
   * @param {Object} properties
   * @return {State} state
   */

  static create(properties = {}) {
    if (properties instanceof State) return properties

    const document = Document.create(properties.document)
    const selection = Selection.create(properties.selection).normalize(properties.document)

    return new State({ document, selection })
  }

  /**
   * Get the kind.
   *
   * @return {String} kind
   */

  get kind() {
    return 'state'
  }

  /**
   * Are there undoable events?
   *
   * @return {Boolean} hasUndos
   */

  get hasUndos() {
    return this.history.undos.size > 0
  }

  /**
   * Are there redoable events?
   *
   * @return {Boolean} hasRedos
   */

  get hasRedos() {
    return this.history.redos.size > 0
  }

  /**
   * Is the current selection blurred?
   *
   * @return {Boolean} isBlurred
   */

  get isBlurred() {
    return this.selection.isBlurred
  }

  /**
   * Is the current selection focused?
   *
   * @return {Boolean} isFocused
   */

  get isFocused() {
    return this.selection.isFocused
  }

  /**
   * Is the current selection collapsed?
   *
   * @return {Boolean} isCollapsed
   */

  get isCollapsed() {
    return this.selection.isCollapsed
  }

  /**
   * Is the current selection expanded?
   *
   * @return {Boolean} isExpanded
   */

  get isExpanded() {
    return this.selection.isExpanded
  }

  /**
   * Is the current selection backward?
   *
   * @return {Boolean} isBackward
   */

  get isBackward() {
    return this.selection.isBackward
  }

  /**
   * Is the current selection forward?
   *
   * @return {Boolean} isForward
   */

  get isForward() {
    return this.selection.isForward
  }

  /**
   * Get the current start key.
   *
   * @return {String} startKey
   */

  get startKey() {
    return this.selection.startKey
  }

  /**
   * Get the current end key.
   *
   * @return {String} endKey
   */

  get endKey() {
    return this.selection.endKey
  }

  /**
   * Get the current start offset.
   *
   * @return {String} startOffset
   */

  get startOffset() {
    return this.selection.startOffset
  }

  /**
   * Get the current end offset.
   *
   * @return {String} endOffset
   */

  get endOffset() {
    return this.selection.endOffset
  }

  /**
   * Get the current anchor key.
   *
   * @return {String} anchorKey
   */

  get anchorKey() {
    return this.selection.anchorKey
  }

  /**
   * Get the current focus key.
   *
   * @return {String} focusKey
   */

  get focusKey() {
    return this.selection.focusKey
  }

  /**
   * Get the current anchor offset.
   *
   * @return {String} anchorOffset
   */

  get anchorOffset() {
    return this.selection.anchorOffset
  }

  /**
   * Get the current focus offset.
   *
   * @return {String} focusOffset
   */

  get focusOffset() {
    return this.selection.focusOffset
  }

  /**
   * Get the current start text node's closest block parent.
   *
   * @return {Block} block
   */

  get startBlock() {
    return this.document.getClosestBlock(this.selection.startKey)
  }

  /**
   * Get the current end text node's closest block parent.
   *
   * @return {Block} block
   */

  get endBlock() {
    return this.document.getClosestBlock(this.selection.endKey)
  }

  /**
   * Get the current anchor text node's closest block parent.
   *
   * @return {Block} block
   */

  get anchorBlock() {
    return this.document.getClosestBlock(this.selection.anchorKey)
  }

  /**
   * Get the current focus text node's closest block parent.
   *
   * @return {Block} block
   */

  get focusBlock() {
    return this.document.getClosestBlock(this.selection.focusKey)
  }

  /**
   * Get the current start text node's closest inline parent.
   *
   * @return {Inline} inline
   */

  get startInline() {
    return this.document.getClosestInline(this.selection.startKey)
  }

  /**
   * Get the current end text node's closest inline parent.
   *
   * @return {Inline} inline
   */

  get endInline() {
    return this.document.getClosestInline(this.selection.endKey)
  }

  /**
   * Get the current anchor text node's closest inline parent.
   *
   * @return {Inline} inline
   */

  get anchorInline() {
    return this.document.getClosestInline(this.selection.anchorKey)
  }

  /**
   * Get the current focus text node's closest inline parent.
   *
   * @return {Inline} inline
   */

  get focusInline() {
    return this.document.getClosestInline(this.selection.focusKey)
  }

  /**
   * Get the current start text node.
   *
   * @return {Text} text
   */

  get startText() {
    return this.document.getDescendant(this.selection.startKey)
  }

  /**
   * Get the current end node.
   *
   * @return {Text} text
   */

  get endText() {
    return this.document.getDescendant(this.selection.endKey)
  }

  /**
   * Get the current anchor node.
   *
   * @return {Text} text
   */

  get anchorText() {
    return this.document.getDescendant(this.selection.anchorKey)
  }

  /**
   * Get the current focus node.
   *
   * @return {Text} text
   */

  get focusText() {
    return this.document.getDescendant(this.selection.focusKey)
  }

  /**
   * Get the characters in the current selection.
   *
   * @return {List} characters
   */

  get characters() {
    return this.document.getCharactersAtRange(this.selection)
  }

  /**
   * Get the marks of the current selection.
   *
   * @return {Set} marks
   */

  get marks() {
    return this.selection.marks || this.document.getMarksAtRange(this.selection)
  }

  /**
   * Get the block nodes in the current selection.
   *
   * @return {List} nodes
   */

  get blocks() {
    return this.document.getBlocksAtRange(this.selection)
  }

  /**
   * Get the fragment of the current selection.
   *
   * @return {List} nodes
   */

  get fragment() {
    return this.document.getFragmentAtRange(this.selection)
  }

  /**
   * Get the inline nodes in the current selection.
   *
   * @return {List} nodes
   */

  get inlines() {
    return this.document.getInlinesAtRange(this.selection)
  }

  /**
   * Get the text nodes in the current selection.
   *
   * @return {List} nodes
   */

  get texts() {
    return this.document.getTextsAtRange(this.selection)
  }

  /**
   * Normalize a state against a `schema`.
   *
   * @param {Schema} schema
   * @return {State}
   */

  normalize(schema) {
    const state = this
    const { document, selection } = this
    let transform = this.transform()
    let failure

    document.filterDescendantsDeep((node) => {
      if (failure = node.validate(schema)) {
        const { value, rule } = failure
        rule.normalize(transform, node, value)
      }
    })

    if (failure = document.validate(schema)) {
      const { value, rule } = failure
      rule.normalize(transform, document, value)
    }

    return transform.apply({ save: false })
  }

  /**
   * Return a new `Transform` with the current state as a starting point.
   *
   * @return {Transform} transform
   */

  transform() {
    const state = this
    return new Transform({ state })
  }

}

/**
 * Export.
 */

export default State
