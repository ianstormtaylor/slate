function isTextNode(node) {
  return node.nodeType === Node.TEXT_NODE
}

function getSnapshot(node) {
  const snapshot = {}
  snapshot.node = node
  if (isTextNode(node)) {
    snapshot.text = node.textContent
  }
  snapshot.children = Array.from(node.childNodes).map(getSnapshot)
  return snapshot
}

function applySnapshot(snapshot) {
  const el = snapshot.node
  if (isTextNode(el)) {
    // Don't do unnecessary DOM update
    if (el.textContent !== snapshot.text) {
      el.textContent = snapshot.text
    }
  }
  snapshot.children.forEach(childSnapshot => {
    applySnapshot(childSnapshot, childSnapshot.node)
    el.appendChild(childSnapshot.node)
  })

  // remove children that shouldn't be there
  const snapLength = snapshot.children.length
  while (el.childNodes.length > snapLength) {
    el.removeChild(el.childNodes[0])
  }

  // remove any clones of this
  const { dataset } = el
  if (!dataset) return // if there's no dataset, don't remove it
  const key = dataset.key
  if (!key) return // if there's no `data-key`, don't remove it
  const dups = new Set(
    Array.from(document.querySelectorAll(`[data-key='${key}']`))
  )
  dups.delete(el)
  dups.forEach(dup => dup.parentElement.removeChild(dup))
}

export default class ElementSnapshot {
  constructor(el) {
    this.snapshot = getSnapshot(el)
  }

  apply() {
    applySnapshot(this.snapshot)
  }
}
