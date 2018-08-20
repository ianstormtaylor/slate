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

export default function polyfillDeprecation(Range) {
  /**
   * Mix in some aliases for convenience / parallelism with the browser APIs.
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
}
