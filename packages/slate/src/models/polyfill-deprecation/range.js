import logger from 'slate-dev-logger'

/* Resolve the deprecated attributes in Range.fromJSON
 * @param {Object} object
 * @return {Object}
*/

export function resolveDeprecatedAttributes(object) {
  let { anchor, focus } = object
  if (anchor && focus) return object

  if (
    !anchor &&
    (object.anchorKey || object.anchorOffset || object.anchorPath)
  ) {
    logger.deprecate(
      '0.37.0',
      '`Range` objects now take a `Point` object as an `anchor` instead of taking `anchorKey/Offset/Path` properties. But you passed:',
      object
    )

    anchor = {
      key: object.anchorKey,
      offset: object.anchorOffset,
      path: object.anchorPath,
    }
  }

  if (!focus && (object.focusKey || object.focusOffset || object.focusPath)) {
    logger.deprecate(
      '0.37.0',
      '`Range` objects now take a `Point` object as a `focus` instead of taking `focusKey/Offset/Path` properties. But you passed:',
      object
    )

    focus = {
      key: object.focusKey,
      offset: object.focusOffset,
      path: object.focusPath,
    }
  }
  return { ...object, anchor, focus }
}

/*
 * Uppercase the first char
 * @param {string} str
 * @return {string}
*/

function upperFirstLetter(str) {
  return `${str.charAt(0).toUpperCase()}${str.substr(1)}`
}

export default function polyfillDeprecation(Range) {
  /*
   * Deprecated edge getters
  */

  ;['offset', 'key', 'path'].forEach(pointProperty => {
    ;['start', 'end', 'focus', 'anchor'].forEach(edge => {
      const alias = `${edge}${upperFirstLetter(pointProperty)}`

      Object.defineProperty(Range.prototype, alias, {
        get() {
          logger.deprecate(
            '0.37.0',
            `The \`range.${alias}\` property has been deprecated, use \`range.${edge}.${pointProperty}\` instead.`
          )
          return this[edge][pointProperty]
        },
      })
    })
  })

  Object.defineProperty(Range.prototype, 'kind', {
    get() {
      logger.deprecate(
        'slate@0.32.0',
        'The `kind` property of Slate objects has been renamed to `object`.'
      )
      return this.object
    },
  })

  /**
   * Deprecated interfaces with renamed new ones
   */

  const ALIAS_METHODS = [
    ['collapseTo', 'moveTo'],
    ['collapseToStartOf', 'moveToStartOfNode'],
    ['collapseToEndOf', 'moveToEndOfNode'],
    ['extend', 'moveFocus'],
    ['extendTo', 'moveFocusTo'],
    ['extendToStartOf', 'moveFocusToStartOfNode'],
    ['extendToEndOf', 'moveFocusToEndOfNode'],
    ['moveToStartOf', 'moveToStartOfNode'],
    ['moveToEndOf', 'moveToEndOfNode'],
    ['moveToRangeOf', 'moveToRangeOfNode'],
  ]

  ALIAS_METHODS.forEach(([alias, method]) => {
    Range.prototype[alias] = function(...args) {
      logger.deprecate(
        '0.37.0',
        `The \`Range.${alias}\` method is deprecated, please use \`Range.${method}\` instead.`
      )

      return this[method](...args)
    }
  })

  /**
   * Ad-hoc Deprecation
   */

  const otherDeprecation = {
    hasAnchorAtStartOf(node) {
      logger.deprecate(
        '0.37.0',
        'The `Range.hasAnchorAtStartOf` method is deprecated, please use `Range.anchor.isAtStartOfNode` instead.'
      )

      return this.anchor.isAtStartOfNode(node)
    },

    hasAnchorAtEndOf(node) {
      logger.deprecate(
        '0.37.0',
        'The `Range.hasAnchorAtEndOf` method is deprecated, please use `Range.anchor.isAtEndOfNode` instead.'
      )

      return this.anchor.isAtEndOfNode(node)
    },

    hasAnchorBetween(node, start, end) {
      logger.deprecate(
        '0.37.0',
        'The `Range.hasAnchorBetween` method is deprecated, please use the `Range.anchor` methods and properties directly instead.'
      )

      return (
        this.anchor.offset <= end &&
        start <= this.anchor.offset &&
        this.anchor.isInNode(node)
      )
    },

    hasAnchorIn(node) {
      logger.deprecate(
        '0.37.0',
        'The `Range.hasAnchorAtEndOf` method is deprecated, please use `Range.anchor.isInNode` instead.'
      )

      return this.anchor.isInNode(node)
    },

    hasEdgeAtStartOf(node) {
      logger.deprecate(
        '0.37.0',
        'The `Range.hasEdgeAtStartOf` method is deprecated.'
      )

      return (
        this.anchor.isAtStartOfNode(node) || this.focus.isAtStartOfNode(node)
      )
    },

    hasEdgeAtEndOf(node) {
      logger.deprecate(
        '0.37.0',
        'The `Range.hasEdgeAtEndOf` method is deprecated.'
      )

      return this.anchor.isAtEndOfNode(node) || this.focus.isAtEndOfNode(node)
    },

    hasEdgeBetween(node, start, end) {
      logger.deprecate(
        '0.37.0',
        'The `Range.hasEdgeBetween` method is deprecated.'
      )

      return (
        (this.anchor.offset <= end &&
          start <= this.anchor.offset &&
          this.anchor.isInNode(node)) ||
        (this.focus.offset <= end &&
          start <= this.focus.offset &&
          this.focus.isInNode(node))
      )
    },

    hasEdgeIn(node) {
      logger.deprecate(
        '0.37.0',
        'The `Range.hasEdgeAtEndOf` method is deprecated.'
      )

      return this.anchor.isInNode(node) || this.focus.isInNode(node)
    },

    hasEndAtStartOf(node) {
      logger.deprecate(
        '0.37.0',
        'The `Range.hasEndAtStartOf` method is deprecated, please use `Range.end.isAtStartOfNode` instead.'
      )

      return this.end.isAtStartOfNode(node)
    },

    hasEndAtEndOf(node) {
      logger.deprecate(
        '0.37.0',
        'The `Range.hasEndAtEndOf` method is deprecated, please use `Range.end.isAtEndOfNode` instead.'
      )

      return this.end.isAtEndOfNode(node)
    },

    hasEndBetween(node, start, end) {
      logger.deprecate(
        '0.37.0',
        'The `Range.hasEndBetween` method is deprecated, please use the `Range.end` methods and properties directly instead.'
      )

      return (
        this.end.offset <= end &&
        start <= this.end.offset &&
        this.end.isInNode(node)
      )
    },

    hasEndIn(node) {
      logger.deprecate(
        '0.37.0',
        'The `Range.hasEndAtEndOf` method is deprecated, please use `Range.end.isInNode` instead.'
      )

      return this.end.isInNode(node)
    },

    hasFocusAtEndOf(node) {
      logger.deprecate(
        '0.37.0',
        'The `Range.hasFocusAtEndOf` method is deprecated, please use `Range.focus.isAtEndOfNode` instead.'
      )

      return this.focus.isAtEndOfNode(node)
    },

    hasFocusAtStartOf(node) {
      logger.deprecate(
        '0.37.0',
        'The `Range.hasFocusAtStartOf` method is deprecated, please use `Range.focus.isAtStartOfNode` instead.'
      )

      return this.focus.isAtStartOfNode(node)
    },

    hasFocusBetween(node, start, end) {
      logger.deprecate(
        '0.37.0',
        'The `Range.hasFocusBetween` method is deprecated, please use the `Range.focus` methods and properties directly instead.'
      )

      return (
        start <= this.focus.offset &&
        this.focus.offset <= end &&
        this.focus.isInNode(node)
      )
    },

    hasFocusIn(node) {
      logger.deprecate(
        '0.37.0',
        'The `Range.hasFocusAtEndOf` method is deprecated, please use `Range.focus.isInNode` instead.'
      )

      return this.focus.isInNode(node)
    },

    hasStartAtStartOf(node) {
      logger.deprecate(
        '0.37.0',
        'The `Range.hasStartAtStartOf` method is deprecated, please use `Range.start.isAtStartOfNode` instead.'
      )

      return this.start.isAtStartOfNode(node)
    },

    hasStartAtEndOf(node) {
      logger.deprecate(
        '0.37.0',
        'The `Range.hasStartAtEndOf` method is deprecated, please use `Range.start.isAtEndOfNode` instead.'
      )

      return this.start.isAtEndOfNode(node)
    },

    hasStartBetween(node, start, end) {
      logger.deprecate(
        '0.37.0',
        'The `Range.hasStartBetween` method is deprecated, please use the `Range.start` methods and properties directly instead.'
      )

      return (
        this.start.offset <= end &&
        start <= this.start.offset &&
        this.start.isInNode(node)
      )
    },

    hasStartIn(node) {
      logger.deprecate(
        '0.37.0',
        'The `Range.hasStartAtEndOf` method is deprecated, please use `Range.start.isInNode` instead.'
      )

      return this.start.isInNode(node)
    },

    isAtStartOf(node) {
      logger.deprecate(
        '0.37.0',
        'The `Range.isAtStartOf` method is deprecated, please use `Range.isCollapsed` and `Point.isAtStartOfNode` instead.'
      )

      return this.isCollapsed && this.anchor.isAtStartOfNode(node)
    },

    isAtEndOf(node) {
      logger.deprecate(
        '0.37.0',
        'The `Range.isAtEndOf` method is deprecated, please use `Range.isCollapsed` and `Point.isAtEndOfNode` instead.'
      )

      return this.isCollapsed && this.anchor.isAtEndOfNode(node)
    },

    blur() {
      logger.deprecate(
        '0.37.0',
        'The `Range.blur` method is deprecated, please use `Range.merge` directly instead.'
      )

      return this.merge({ isFocused: false })
    },

    deselect() {
      logger.deprecate(
        '0.37.0',
        'The `Range.deselect` method is deprecated, please use `Range.create` to create a new unset range instead.'
      )

      return Range.create()
    },

    moveAnchorOffsetTo(o) {
      logger.deprecate(
        '0.37.0',
        'The `Range.moveAnchorOffsetTo` method is deprecated, please use `Range.moveAnchorTo(offset)` instead.'
      )

      return this.moveAnchorTo(o)
    },

    moveFocusOffsetTo(fo) {
      logger.deprecate(
        '0.37.0',
        'The `Range.moveFocusOffsetTo` method is deprecated, please use `Range.moveFocusTo(offset)` instead.'
      )

      return this.moveFocusTo(fo)
    },

    moveStartOffsetTo(o) {
      logger.deprecate(
        '0.37.0',
        'The `Range.moveStartOffsetTo` method is deprecated, please use `Range.moveStartTo(offset)` instead.'
      )

      return this.moveStartTo(o)
    },

    moveEndOffsetTo(o) {
      logger.deprecate(
        '0.37.0',
        'The `Range.moveEndOffsetTo` method is deprecated, please use `Range.moveEndTo(offset)` instead.'
      )

      return this.moveEndTo(o)
    },

    moveOffsetsTo(ao, fo = ao) {
      logger.deprecate(
        '0.37.0',
        'The `Range.moveOffsetsTo` method is deprecated, please use `Range.moveAnchorTo` and `Range.moveFocusTo` in sequence instead.'
      )

      return this.moveAnchorTo(ao).moveFocusTo(fo)
    },

    moveAnchorToStartOf(node) {
      logger.deprecate(
        '0.37.0',
        'The `Range.moveAnchorToStartOf` method is deprecated, please use `Range.moveAnchorToStartOfNode` instead.'
      )

      return this.moveAnchorToStartOfNode(node)
    },

    moveAnchorToEndOf(node) {
      logger.deprecate(
        '0.37.0',
        'The `Range.moveAnchorToEndOf` method is deprecated, please use `Range.moveAnchorToEndOfNode` instead.'
      )

      return this.moveAnchorToEndOfNode(node)
    },

    moveFocusToStartOf(node) {
      logger.deprecate(
        '0.37.0',
        'The `Range.moveFocusToStartOf` method is deprecated, please use `Range.moveFocusToStartOfNode` instead.'
      )

      return this.moveFocusToStartOfNode(node)
    },

    moveFocusToEndOf(node) {
      logger.deprecate(
        '0.37.0',
        'The `Range.moveFocusToEndOf` method is deprecated, please use `Range.moveFocusToEndOfNode` instead.'
      )

      return this.moveFocusToEndOfNode(node)
    },

    collapseToAnchor() {
      logger.deprecate(
        '0.37.0',
        'The `Range.collapseToAnchor` method is deprecated, please use `Range.moveToAnchor` instead.'
      )

      return this.moveToAnchor()
    },

    collapseToEnd() {
      logger.deprecate(
        '0.37.0',
        'The `Range.collapseToEnd` method is deprecated, please use `Range.moveToEnd` instead.'
      )

      return this.moveToEnd()
    },

    collapseToFocus() {
      logger.deprecate(
        '0.37.0',
        'The `Range.collapseToFocus` method is deprecated, please use `Range.moveToFocus` instead.'
      )

      return this.moveToFocus()
    },
    collapseToStart() {
      logger.deprecate(
        '0.37.0',
        'The `Range.collapseToStart` method is deprecated, please use `Range.moveToStart` instead.'
      )

      return this.moveToStart()
    },
    move(n = 1) {
      logger.deprecate(
        '0.37.0',
        'The `Range.move` method is deprecated, please use `Range.moveForward` or `Range.moveBackward` instead.'
      )

      return n > 0 ? this.moveForward(n) : this.moveBackward(-n)
    },
    moveAnchor(n = 1) {
      logger.deprecate(
        '0.37.0',
        'The `Range.moveAnchor` method is deprecated, please use `Range.moveAnchorForward` or `Range.moveAnchorBackward` instead.'
      )

      return n > 0 ? this.moveAnchorForward(n) : this.moveAnchorBackward(-n)
    },
    moveEnd(n = 1) {
      logger.deprecate(
        '0.37.0',
        'The `Range.moveEnd` method is deprecated, please use `Range.moveEndForward` or `Range.moveEndBackward` instead.'
      )

      return n > 0 ? this.moveEndForward(n) : this.moveEndBackward(-n)
    },
    moveFocus(n = 1) {
      logger.deprecate(
        '0.37.0',
        'The `Range.moveFocus` method is deprecated, please use `Range.moveFocusForward` or `Range.moveFocusBackward` instead.'
      )

      return n > 0 ? this.moveFocusForward(n) : this.moveFocusBackward(-n)
    },
    moveStart(n = 1) {
      logger.deprecate(
        '0.37.0',
        'The `Range.moveStart` method is deprecated, please use `Range.moveStartForward` or `Range.moveStartBackward` instead.'
      )

      return n > 0 ? this.moveStartForward(n) : this.moveStartBackward(-n)
    },
  }

  Object.entries(otherDeprecation).forEach(([alias, method]) => {
    Range.prototype[alias] = method
  })
}
