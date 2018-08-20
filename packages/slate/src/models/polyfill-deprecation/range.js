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

  const DEPRECATED_EDGE_METHODS = [
    {
      getAlias: edge => `has${edge}AtStartOf`,
      pointMethod: 'isAtStartOfNode',
    },
    {
      getAlias: edge => `has${edge}AtEndOf`,
      pointMethod: `isAtEndOfNode`,
    },
    {
      getAlias: edge => `has${edge}In`,
      pointMethod: `isInNode`,
    },
    {
      getAlias: edge => `has${edge}Between`,
      pointMethod: `isBetweenInNode`,
    },
  ]

  DEPRECATED_EDGE_METHODS.forEach(({ getAlias, pointMethod }) => {
    ;['start', 'end', 'focus', 'anchor', 'edge'].forEach(edge => {
      const alias = getAlias(edge.charAt(0).toUpperCase() + edge.substr(1))

      Range.prototype[alias] = function(...args) {
        logger.deprecate(
          '0.37.0',
          `The \`Range.${alias}\` method is deprecated, please use \`this.${edge}.${pointMethod}\` instead.`
        )

        if (edge === 'edge') {
          return (
            this.focus[pointMethod](...args) ||
            this.anchor[pointMethod](...args)
          )
        }

        return this[edge][pointMethod](...args)
      }
    })
  })

  const DEPRECATED_COLLAPSED_METHODS = [
    {
      getAlias: edge => `isAt${edge}Of`,
      getPointMethod: edge => `isAt${edge}OfNode`,
    },
  ]

  DEPRECATED_COLLAPSED_METHODS.forEach(({ getAlias, getPointMethod }) => {
    ;['Start', 'End'].forEach(edge => {
      const alias = getAlias(edge)
      const pointMethod = getPointMethod(edge)

      Range.prototype[alias] = function(...args) {
        logger.deprecate(
          '0.37.0',
          `The \`Range.${alias}\` method is deprecated, please use \`Range.isCollapsed\` and \`Point.${pointMethod}\` instead.`
        )
        return this.isCollapsed && this.anchor[pointMethod](...args)
      }
    })
  })

  const DEPRECATED_EGDES_BY_NEW_RANGE_METHODS = [
    {
      getAlias: edge => `move${edge}OffsetTo`,
      getNewMethod: edge => `move${edge}To`,
      fixArgs: '(offset)',
    },
    {
      getAlias: edge => `move${edge}ToStartOf`,
      getNewMethod: edge => `move${edge}ToStartOfNode`,
      edges: ['Focus', 'Anchor'],
    },
    {
      getAlias: edge => `move${edge}ToEndOf`,
      getNewMethod: edge => `move${edge}ToEndOfNode`,
      edges: ['Focus', 'Anchor'],
    },
    {
      getAlias: edge => `collapseTo${edge}`,
      getNewMethod: edge => `moveTo${edge}`,
    },
  ]

  DEPRECATED_EGDES_BY_NEW_RANGE_METHODS.forEach(
    ({
      getAlias,
      getNewMethod,
      fixArgs = '',
      edges = ['Start', 'End', 'Focus', 'Anchor'],
    }) => {
      edges.forEach(edge => {
        const alias = getAlias(edge)
        const method = getNewMethod(edge)

        Range.prototype[alias] = function(...args) {
          logger.deprecate(
            '0.37.0',
            `The \`Range.${alias}\` method is deprecated, please use \`Range.isCollapsed\` and \`Point.${method}${fixArgs}\` instead.`
          )
          return this[method](...args)
        }
      })
    }
  )

  /**
   * Ad-hoc Deprecation
   */

  const otherDeprecation = {
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

    moveOffsetsTo(ao, fo = ao) {
      logger.deprecate(
        '0.37.0',
        'The `Range.moveOffsetsTo` method is deprecated, please use `Range.moveAnchorTo` and `Range.moveFocusTo` in sequence instead.'
      )

      return this.moveAnchorTo(ao).moveFocusTo(fo)
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
