import Block from '../models/block'
import Change from '../controllers/change'
import Decoration from '../models/decoration'
import Document from '../models/document'
import Editor from '../controllers/editor'
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
import isObject, { TYPES } from '../utils/is-object'
import mixin from '../utils/mixin'

/**
 * A factory for the interface that all Slate objects implement.
 *
 * @type {Function}
 */

function create(type) {
  const TYPE = TYPES[type]
  const camel = `${type.charAt(0).toUpperCase()}${type.slice(1)}`
  const is = `is${camel}`

  class ObjectInterface {
    /**
     * Return the type of the object.
     *
     * @return {String}
     */

    get object() {
      return type
    }
  }

  ObjectInterface[is] = isObject.bind(null, type)
  ObjectInterface.prototype[TYPE] = true
  return ObjectInterface
}

/**
 * Mix in the object interfaces.
 */

mixin(create('block'), [Block])
mixin(create('change'), [Change])
mixin(create('decoration'), [Decoration])
mixin(create('document'), [Document])
mixin(create('editor'), [Editor])
mixin(create('inline'), [Inline])
mixin(create('leaf'), [Leaf])
mixin(create('mark'), [Mark])
mixin(create('node'), [Node])
mixin(create('operation'), [Operation])
mixin(create('point'), [Point])
mixin(create('range'), [Range])
mixin(create('selection'), [Selection])
mixin(create('text'), [Text])
mixin(create('value'), [Value])
