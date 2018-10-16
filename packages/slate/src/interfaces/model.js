import mixin from '../utils/mixin'
import Block from '../models/block'
import Decoration from '../models/decoration'
import Document from '../models/document'
import Inline from '../models/inline'
import Leaf from '../models/leaf'
import Mark from '../models/mark'
import Node from '../models/node'
import Operation from '../models/operation'
import Point from '../models/point'
import Range from '../models/range'
import Selection from '../models/selection'
import Text from '../models/text'
import Value from '../models/value'

/**
 * The interface that all Slate models implement.
 *
 * @type {Class}
 */

class ModelInterface {
  /**
   * Alias `fromJS`.
   */

  static fromJS(...args) {
    return this.fromJSON(...args)
  }

  /**
   * Alias `toJS`.
   */

  toJS(...args) {
    return this.toJSON(...args)
  }
}

/**
 * Mix in the common interface.
 *
 * @param {Record}
 */

mixin(ModelInterface, [
  Block,
  Decoration,
  Document,
  Inline,
  Leaf,
  Mark,
  Node,
  Operation,
  Point,
  Range,
  Selection,
  Text,
  Value,
])
