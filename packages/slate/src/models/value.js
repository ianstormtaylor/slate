import isPlainObject from 'is-plain-object'
import invariant from 'tiny-invariant'
import { Record, Set, List } from 'immutable'

import Annotation from './annotation'
import Data from './data'
import Document from './document'
import Mark from './mark'
import PathUtils from '../utils/path-utils'

/**
 * Default properties.
 *
 * @type {Object}
 */

const DEFAULTS = {
  annotations: undefined,
  data: undefined,
  document: undefined,
  selection: undefined,
}

/**
 * Value.
 *
 * @type {Value}
 */

class Value extends Record(DEFAULTS) {
  /**
   * Create a new `Value` with `attrs`.
   *
   * @param {Object|Value} attrs
   * @param {Object} options
   * @return {Value}
   */

  static create(attrs = {}, options = {}) {
    if (Value.isValue(attrs)) {
      return attrs
    }

    if (isPlainObject(attrs)) {
      return Value.fromJSON(attrs, options)
    }

    throw new Error(
      `\`Value.create\` only accepts objects or values, but you passed it: ${attrs}`
    )
  }

  /**
   * Create a dictionary of settable value properties from `attrs`.
   *
   * @param {Object|Value} attrs
   * @return {Object}
   */

  static createProperties(a = {}) {
    if (Value.isValue(a)) {
      return {
        annotations: a.annotations,
        data: a.data,
      }
    }

    if (isPlainObject(a)) {
      const p = {}
      if ('annotations' in a)
        p.annotations = Annotation.createMap(a.annotations)
      if ('data' in a) p.data = Data.create(a.data)
      return p
    }

    throw new Error(
      `\`Value.createProperties\` only accepts objects or values, but you passed it: ${a}`
    )
  }

  /**
   * Create a `Value` from a JSON `object`.
   *
   * @param {Object} object
   * @param {Object} options
   *   @property {Boolean} normalize
   *   @property {Array} plugins
   * @return {Value}
   */

  static fromJSON(object, options = {}) {
    let { data = {}, annotations = {}, document = {}, selection = {} } = object
    data = Data.fromJSON(data)
    document = Document.fromJSON(document)
    selection = document.createSelection(selection)
    annotations = Annotation.createMap(annotations)

    if (selection.isUnset) {
      const text = document.getFirstText()
      if (text) selection = selection.moveToStartOfNode(text)
      selection = document.createSelection(selection)
    }

    const value = new Value({
      annotations,
      data,
      document,
      selection,
    })

    return value
  }

  /**
   * Get the current start text node's closest block parent.
   *
   * @return {Block}
   */

  get startBlock() {
    return (
      this.selection.start.key &&
      this.document.getClosestBlock(this.selection.start.key)
    )
  }

  /**
   * Get the current end text node's closest block parent.
   *
   * @return {Block}
   */

  get endBlock() {
    return (
      this.selection.end.key &&
      this.document.getClosestBlock(this.selection.end.key)
    )
  }

  /**
   * Get the current anchor text node's closest block parent.
   *
   * @return {Block}
   */

  get anchorBlock() {
    return (
      this.selection.anchor.key &&
      this.document.getClosestBlock(this.selection.anchor.key)
    )
  }

  /**
   * Get the current focus text node's closest block parent.
   *
   * @return {Block}
   */

  get focusBlock() {
    return (
      this.selection.focus.key &&
      this.document.getClosestBlock(this.selection.focus.key)
    )
  }

  /**
   * Get the current start text node's closest inline parent.
   *
   * @return {Inline}
   */

  get startInline() {
    return (
      this.selection.start.key &&
      this.document.getClosestInline(this.selection.start.key)
    )
  }

  /**
   * Get the current end text node's closest inline parent.
   *
   * @return {Inline}
   */

  get endInline() {
    return (
      this.selection.end.key &&
      this.document.getClosestInline(this.selection.end.key)
    )
  }

  /**
   * Get the current anchor text node's closest inline parent.
   *
   * @return {Inline}
   */

  get anchorInline() {
    return (
      this.selection.anchor.key &&
      this.document.getClosestInline(this.selection.anchor.key)
    )
  }

  /**
   * Get the current focus text node's closest inline parent.
   *
   * @return {Inline}
   */

  get focusInline() {
    return (
      this.selection.focus.key &&
      this.document.getClosestInline(this.selection.focus.key)
    )
  }

  /**
   * Get the current start text node.
   *
   * @return {Text}
   */

  get startText() {
    return (
      this.selection.start.key &&
      this.document.getDescendant(this.selection.start.key)
    )
  }

  /**
   * Get the current end node.
   *
   * @return {Text}
   */

  get endText() {
    return (
      this.selection.end.key &&
      this.document.getDescendant(this.selection.end.key)
    )
  }

  /**
   * Get the current anchor node.
   *
   * @return {Text}
   */

  get anchorText() {
    return (
      this.selection.anchor.key &&
      this.document.getDescendant(this.selection.anchor.key)
    )
  }

  /**
   * Get the current focus node.
   *
   * @return {Text}
   */

  get focusText() {
    return (
      this.selection.focus.key &&
      this.document.getDescendant(this.selection.focus.key)
    )
  }

  /**
   * Get the next block node.
   *
   * @return {Block}
   */

  get nextBlock() {
    return (
      this.selection.end.key &&
      this.document.getNextBlock(this.selection.end.key)
    )
  }

  /**
   * Get the previous block node.
   *
   * @return {Block}
   */

  get previousBlock() {
    return (
      this.selection.start.key &&
      this.document.getPreviousBlock(this.selection.start.key)
    )
  }

  /**
   * Get the next inline node.
   *
   * @return {Inline}
   */

  get nextInline() {
    return (
      this.selection.end.key &&
      this.document.getNextInline(this.selection.end.key)
    )
  }

  /**
   * Get the previous inline node.
   *
   * @return {Inline}
   */

  get previousInline() {
    return (
      this.selection.start.key &&
      this.document.getPreviousInline(this.selection.start.key)
    )
  }

  /**
   * Get the next text node.
   *
   * @return {Text}
   */

  get nextText() {
    return (
      this.selection.end.key &&
      this.document.getNextText(this.selection.end.key)
    )
  }

  /**
   * Get the previous text node.
   *
   * @return {Text}
   */

  get previousText() {
    return (
      this.selection.start.key &&
      this.document.getPreviousText(this.selection.start.key)
    )
  }

  /**
   * Get the marks of the current selection.
   *
   * @return {Set<Mark>}
   */

  get marks() {
    return this.selection.isUnset
      ? new Set()
      : this.selection.marks || this.document.getMarksAtRange(this.selection)
  }

  /**
   * Get the active marks of the current selection.
   *
   * @return {Set<Mark>}
   */

  get activeMarks() {
    return this.selection.isUnset
      ? new Set()
      : this.selection.marks ||
          this.document.getActiveMarksAtRange(this.selection)
  }

  /**
   * Get the block nodes in the current selection.
   *
   * @return {List<Block>}
   */

  get blocks() {
    return this.selection.isUnset
      ? new List()
      : this.document.getLeafBlocksAtRange(this.selection)
  }

  /**
   * Get the fragment of the current selection.
   *
   * @return {Document}
   */

  get fragment() {
    return this.selection.isUnset
      ? Document.create()
      : this.document.getFragmentAtRange(this.selection)
  }

  /**
   * Get the bottom-most inline nodes in the current selection.
   *
   * @return {List<Inline>}
   */

  get inlines() {
    return this.selection.isUnset
      ? new List()
      : this.document.getLeafInlinesAtRange(this.selection)
  }

  /**
   * Get the text nodes in the current selection.
   *
   * @return {List<Text>}
   */

  get texts() {
    return this.selection.isUnset
      ? new List()
      : this.document.getTextsAtRange(this.selection)
  }

  /**
   * Add an `annotation` to the value.
   *
   * @param {Annotation} annotation
   * @param {Mark} mark
   * @return {Value}
   */

  addAnnotation(annotation) {
    annotation = Annotation.create(annotation)
    let value = this
    let { annotations, document } = value
    const { key } = annotation
    annotation = annotation.updatePoints(point => point.normalize(document))
    annotations = annotations.set(key, annotation)
    value = value.set('annotations', annotations)
    return value
  }

  /**
   * Add `mark` to text at `path`.
   *
   * @param {List|String} path
   * @param {Mark} mark
   * @return {Value}
   */

  addMark(path, mark) {
    mark = Mark.create(mark)
    let value = this
    let { document } = value
    document = document.addMark(path, mark)
    value = value.set('document', document)
    return value
  }

  /**
   * Insert a `node`.
   *
   * @param {List|String} path
   * @param {Node} node
   * @return {Value}
   */

  insertNode(path, node) {
    let value = this
    let { document } = value
    document = document.insertNode(path, node)
    value = value.set('document', document)

    value = value.mapRanges(range =>
      range.updatePoints(point => point.setPath(null))
    )

    return value
  }

  /**
   * Insert `text` at `offset` in node by `path`.
   *
   * @param {List|String} path
   * @param {Number} offset
   * @param {String} text
   * @return {Value}
   */

  insertText(path, offset, text) {
    let value = this
    let { document } = value
    let node = document.assertNode(path)
    document = document.insertText(path, offset, text)
    node = document.assertNode(path)
    value = value.set('document', document)

    value = value.mapPoints(point => {
      if (point.key === node.key && point.offset >= offset) {
        return point.setOffset(point.offset + text.length)
      } else {
        return point
      }
    })

    return value
  }

  /**
   * Merge a node backwards its previous sibling.
   *
   * @param {List|Key} path
   * @return {Value}
   */

  mergeNode(path) {
    let value = this
    const { document } = value
    const newDocument = document.mergeNode(path)
    path = document.resolvePath(path)
    const withPath = PathUtils.decrement(path)
    const one = document.getNode(withPath)
    const two = document.getNode(path)
    value = value.set('document', newDocument)

    value = value.mapRanges(range => {
      if (two.object === 'text') {
        const max = one.text.length

        if (range.anchor.key === two.key) {
          range = range.moveAnchorTo(one.key, max + range.anchor.offset)
        }

        if (range.focus.key === two.key) {
          range = range.moveFocusTo(one.key, max + range.focus.offset)
        }
      }

      range = range.updatePoints(point => point.setPath(null))

      return range
    })

    return value
  }

  /**
   * Move a node by `path` to `newPath`.
   *
   * A `newIndex` can be provided when move nodes by `key`, to account for not
   * being able to have a key for a location in the tree that doesn't exist yet.
   *
   * @param {List|Key} path
   * @param {List|Key} newPath
   * @param {Number} newIndex
   * @return {Value}
   */

  moveNode(path, newPath, newIndex = 0) {
    let value = this
    let { document } = value

    if (PathUtils.isEqual(path, newPath)) {
      return value
    }

    document = document.moveNode(path, newPath, newIndex)
    value = value.set('document', document)
    value = value.mapPoints(point => point.setPath(null))
    return value
  }

  /**
   * Remove an `annotation` from the value.
   *
   * @param {Annotation} annotation
   * @param {Mark} mark
   * @return {Value}
   */

  removeAnnotation(annotation) {
    annotation = Annotation.create(annotation)
    let value = this
    let { annotations } = value
    const { key } = annotation
    annotations = annotations.delete(key)
    value = value.set('annotations', annotations)
    return value
  }

  /**
   * Remove `mark` at `path`.
   *
   * @param {List|String} path
   * @param {Mark} mark
   * @return {Value}
   */

  removeMark(path, mark) {
    mark = Mark.create(mark)
    let value = this
    let { document } = value
    document = document.removeMark(path, mark)
    value = value.set('document', document)
    return value
  }

  /**
   * Remove a node by `path`.
   *
   * @param {List|String} path
   * @return {Value}
   */

  removeNode(path) {
    let value = this
    let { document } = value
    const node = document.assertNode(path)
    const first = node.object === 'text' ? node : node.getFirstText() || node
    const last = node.object === 'text' ? node : node.getLastText() || node
    const prev = document.getPreviousText(first.key)
    const next = document.getNextText(last.key)

    document = document.removeNode(path)
    value = value.set('document', document)

    value = value.mapRanges(range => {
      const { anchor, focus } = range

      if (node.hasNode(anchor.key)) {
        range = prev
          ? range.moveAnchorTo(prev.key, prev.text.length)
          : next ? range.moveAnchorTo(next.key, 0) : range.unset()
      }

      if (node.hasNode(focus.key)) {
        range = prev
          ? range.moveFocusTo(prev.key, prev.text.length)
          : next ? range.moveFocusTo(next.key, 0) : range.unset()
      }

      range = range.updatePoints(point => point.setPath(null))

      return range
    })

    return value
  }

  /**
   * Remove `text` at `offset` in node by `path`.
   *
   * @param {List|Key} path
   * @param {Number} offset
   * @param {String} text
   * @return {Value}
   */

  removeText(path, offset, text) {
    let value = this
    let { document } = value
    const node = document.assertNode(path)
    document = document.removeText(path, offset, text)
    value = value.set('document', document)

    const { length } = text
    const start = offset
    const end = offset + length

    value = value.mapPoints(point => {
      if (point.key !== node.key) {
        return point
      }

      if (point.offset >= end) {
        return point.setOffset(point.offset - length)
      }

      if (point.offset > start) {
        return point.setOffset(start)
      }

      return point
    })

    return value
  }

  /**
   * Add an `annotation` to the value.
   *
   * @param {Annotation} annotation
   * @param {Mark} mark
   * @return {Value}
   */

  setAnnotation(properties, newProperties) {
    newProperties = Annotation.createProperties(newProperties)
    const annotation = Annotation.create(properties)
    const next = annotation.merge(newProperties)
    let value = this
    let { annotations } = value
    const { key } = annotation
    annotations = annotations.set(key, next)
    value = value.set('annotations', annotations)
    return value
  }

  /**
   * Set `properties` on a node.
   *
   * @param {List|String} path
   * @param {Object} properties
   * @return {Value}
   */

  setNode(path, properties) {
    let value = this
    let { document } = value
    document = document.setNode(path, properties)
    value = value.set('document', document)
    return value
  }

  /**
   * Set `properties` on `mark` on text at `offset` and `length` in node.
   *
   * @param {List|String} path
   * @param {Mark} mark
   * @param {Object} properties
   * @return {Value}
   */

  setMark(path, mark, properties) {
    let value = this
    let { document } = value
    document = document.setMark(path, mark, properties)
    value = value.set('document', document)
    return value
  }

  /**
   * Set `properties` on the value.
   *
   * @param {Object} properties
   * @return {Value}
   */

  setProperties(properties) {
    let value = this
    const { document } = value
    const { data, annotations } = properties
    const props = {}

    if (data) {
      props.data = data
    }

    if (annotations) {
      props.annotations = annotations.map(a => {
        return a.isSet ? a : document.resolveAnnotation(a)
      })
    }

    value = value.merge(props)
    return value
  }

  /**
   * Set `properties` on the selection.
   *
   * @param {Value} value
   * @param {Operation} operation
   * @return {Value}
   */

  setSelection(properties) {
    let value = this
    let { document, selection } = value
    const next = selection.setProperties(properties)
    selection = document.resolveSelection(next)
    value = value.set('selection', selection)
    return value
  }

  /**
   * Split a node by `path` at `position` with optional `properties` to apply
   * to the newly split node.
   *
   * @param {List|String} path
   * @param {Number} position
   * @param {Object} properties
   * @return {Value}
   */

  splitNode(path, position, properties) {
    let value = this
    const { document } = value
    const newDocument = document.splitNode(path, position, properties)
    const node = document.assertNode(path)
    value = value.set('document', newDocument)

    value = value.mapRanges(range => {
      const next = newDocument.getNextText(node.key)
      const { anchor, focus } = range

      // If the anchor was after the split, move it to the next node.
      if (node.key === anchor.key && position <= anchor.offset) {
        range = range.moveAnchorTo(next.key, anchor.offset - position)
      }

      // If the focus was after the split, move it to the next node.
      if (node.key === focus.key && position <= focus.offset) {
        range = range.moveFocusTo(next.key, focus.offset - position)
      }

      range = range.updatePoints(point => point.setPath(null))

      return range
    })

    return value
  }

  /**
   * Map all range objects to apply adjustments with an `iterator`.
   *
   * @param {Function} iterator
   * @return {Value}
   */

  mapRanges(iterator) {
    let value = this
    const { document, selection, annotations } = value

    let sel = selection.isSet ? iterator(selection) : selection
    if (!sel) sel = selection.unset()
    if (sel !== selection) sel = document.createSelection(sel)
    value = value.set('selection', sel)

    let anns = annotations.map(annotation => {
      let n = annotation.isSet ? iterator(annotation) : annotation
      if (n && n !== annotation) n = document.createAnnotation(n)
      return n
    })

    anns = anns.filter(annotation => !!annotation)
    value = value.set('annotations', anns)
    return value
  }

  mapPoints(iterator) {
    return this.mapRanges(range => range.updatePoints(iterator))
  }

  /**
   * Return a JSON representation of the value.
   *
   * @param {Object} options
   * @return {Object}
   */

  toJSON(options = {}) {
    const object = {
      object: this.object,
      document: this.document.toJSON(options),
    }

    if (options.preserveData) {
      object.data = this.data.toJSON(options)
    }

    if (options.preserveAnnotations) {
      object.annotations = this.annotations
        .map(a => a.toJSON(options))
        .toObject()
    }

    if (options.preserveSelection) {
      object.selection = this.selection.toJSON(options)
    }

    return object
  }

  /**
   * Deprecated.
   */

  get history() {
    invariant(
      false,
      'As of Slate 0.42.0, the `value.history` model no longer exists, and the history is stored in `value.data` instead using plugins.'
    )
  }

  change() {
    invariant(
      false,
      'As of Slate 0.42.0, value object are no longer schema-aware, and the `value.change()` method is no longer available. Use the `editor.change()` method on the new `Editor` controller instead.'
    )
  }
}

/**
 * Export.
 */

export default Value
