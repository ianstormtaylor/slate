
/**
 * Strip all of the dynamic properties from a `json` object.
 *
 * @param {Object} json
 * @return {Object}
 */

function stripDynamic(json) {
  const { key, ...props } = json

  if (props.nodes) {
    props.nodes = props.nodes.map(stripDynamic)
  }

  return props
}

/**
 * Export.
 */

export default stripDynamic
