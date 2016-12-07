
import React from 'react'
import TestUtils from 'react-addons-test-utils'
import keycode from 'keycode'
import { findDOMNode } from 'react-dom'

/**
 * Simulate an `event` on a `node` with `data`.
 *
 * @param {Component|Element} node
 * @param {String} event
 * @param {Object} data
 */

function simulate(node, event, data) {
  // Allow for passing react component instances for convenience.
  if (node instanceof React.Component) {
    node = findDOMNode(node)
  }

  // Allow for passing a key name string for convenience.
  if (
    (event == 'keyDown' || event == 'keyUp') &&
    (typeof data == 'string')
  ) {
    const code = keycode(data)
    data = {
      which: code,
      keyCode: code,
    }
  }

  // Simulate the event.
  TestUtils.Simulate[event](node, data)
}

/**
 * Export.
 *
 * @type {Function}
 */

export default simulate
