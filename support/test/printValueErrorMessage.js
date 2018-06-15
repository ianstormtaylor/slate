import isEqual from 'lodash/isEqual'

const GLOBAL_INDENT = '      '

function insertCursor(text, offset) {
  return [text.slice(0, offset), '|', text.slice(offset)].join('')
}

function printSlateNode(node, selection, indent = '', path = []) {
  if (!node) return ''

  const isTextNode = node.object === 'text'
  const type = node.type ? `.${node.type}` : ''
  let print = ''

  let data =
    typeof node.data === 'object' &&
    Object.keys(node.data).length &&
    JSON.stringify(node.data)
  data = data ? ` data=${data}` : ''

  let text = isTextNode ? `${node.leaves.map(l => l.text).join('')}` : ''

  let selectionCursor = ''
  if (selection) {
    const anchor = isEqual(selection.anchorPath, path)
    const focus = isEqual(selection.focusPath, path)

    if (anchor && focus) {
      selectionCursor = ' <- cursor'
      text = insertCursor(text, selection.anchorOffset)
    } else if (anchor) {
      selectionCursor = ' <- anchor'
      text = insertCursor(text, selection.anchorOffset)
    } else if (focus) {
      selectionCursor = ' <- focus'
      text = insertCursor(text, selection.focusOffset)
    }
  }

  print += `${GLOBAL_INDENT}${indent}<${node.object}${type}${data}>${text}${
    isTextNode ? '' : '\n'
  }`

  if (node.nodes) {
    node.nodes.forEach((n, i) => {
      const nodePath = path.concat([i])
      print += printSlateNode(n, selection, `${indent}|  `, nodePath)
    })
  }

  print += `${isTextNode ? '' : `${GLOBAL_INDENT}${indent}`}</${
    node.object
  }>${selectionCursor}\n`

  return print
}

function printValueErrorMessage(assertion, actual, expected) {
  // Using try {} catch {} here to prevent any errors thrown here influencing test runs
  try {
    return `
    Expected actual Value:
${printSlateNode(actual.document, actual.selection)}
    to ${assertion} expected Value:
${printSlateNode(expected.document, expected.selection)}
  `
  } catch (e) {
    return
  }
}

export default printValueErrorMessage
