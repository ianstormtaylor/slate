import closest from './closest'

// Takes a node and merges it with its dup. The dup is created when the
// browser splits the DOM when the user hits ENTER. In Android, we can't
// identify the `enter` so we have to let it happen.
//
// This method also returns the `offsetKey` and the `offset` of where the
// split took place. We return null when we don't know the answer.
export default function mergeSplitText(node) {
  const slateLeaf = closest(node, "[data-slate-leaf]")
  const offsetKey = slateLeaf.dataset.offsetKey
  const textNodes = document.querySelectorAll(
    `[data-offset-key='${offsetKey}']`
  )

  // On Desktop Chrome: This happens if you split at the end of a block
  if (node.nodeType !== Node.TEXT_NODE) {
    return { offsetKey, offset: textNodes[0].textContent.length }
  }

  // On Desktop Chrome:
  // This happens if you split at the beginning or end of a node.
  // Does not happen at beginning of block.
  if (textNodes.length === 1) {
    return { offsetKey, offset: 0 }
  }

  const offset = textNodes[0].textContent.length
  node.textContent = Array.from(textNodes)
    .map(textNode => textNode.textContent)
    .join("")
  return { offsetKey, offset }
}

