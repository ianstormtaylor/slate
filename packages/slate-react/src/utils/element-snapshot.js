function isTextNode(node) {
  return node.nodeType === Node.TEXT_NODE
}

function getElementSnapshot(node) {
  const snapshot = {}
  snapshot.node = node
  if (isTextNode(node)) {
    snapshot.text = node.textContent
  }
  snapshot.children = Array.from(node.childNodes).map(getElementSnapshot)
  return snapshot
}

function getSnapshot(elements) {
  if (!elements.length) throw new Error(`elements must be an Array`)
  // const snapshot = __getSnapshot(node)
  const lastElement = elements[elements.length - 1]
  const snapshot = {
    elements: elements.map(getElementSnapshot),
    parent: lastElement.parentElement,
    next: lastElement.nextElementSibling,
  }
  return snapshot
}

function applyElementSnapshot(snapshot) {
  const el = snapshot.node
  if (isTextNode(el)) {
    // Update text if it is different
    if (el.textContent !== snapshot.text) {
      el.textContent = snapshot.text
    }
  }
  snapshot.children.forEach(childSnapshot => {
    applyElementSnapshot(childSnapshot, childSnapshot.node)
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

function applySnapshot(snapshot) {
  const { elements, next, parent } = snapshot
  elements.forEach(applyElementSnapshot)
  const lastElement = elements[elements.length - 1].node
  if (snapshot.next) {
    parent.insertBefore(lastElement, next)
  } else {
    parent.appendChild(lastElement)
  }
  let prevElement = lastElement
  for (let i = elements.length - 2; i >= 0; i--) {
    const element = elements[i].node
    parent.insertBefore(element, prevElement)
    prevElement = element
  }
}

export default class ElementSnapshot {
  constructor(els, data) {
    this.snapshot = getSnapshot(els)
    this.data = data
  }

  apply() {
    applySnapshot(this.snapshot)
  }

  getData() {
    return this.data
  }
}
