/**
 * Is the given node a text node?
 * 
 * @param  {node} node
 * @return {Boolean}
 */
function isTextNode(node) {
  return node.nodeType === Node.TEXT_NODE
}

/**
 * Takes a node and returns a snapshot of the node.
 * 
 * @param  {node} node
 * @return {object} element snapshot
 */
function getElementSnapshot(node) {
  const snapshot = {}
  snapshot.node = node
  if (isTextNode(node)) {
    snapshot.text = node.textContent
  }
  snapshot.children = Array.from(node.childNodes).map(getElementSnapshot)
  return snapshot
}

/**
 * Takes an array of elements and returns a snapshot
 * 
 * @param  {elements[]} elements
 * @return {object} snapshot
 */
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

/**
 * Takes an element snapshot and applies it to the element in the DOM.
 * Basically, it fixes the DOM to the point in time that the snapshot was
 * taken. This will put the DOM back in sync with React.
 * 
 * @param  {object} element snapshot
 */
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

  // remove any clones from the DOM. This can happen when a block is split.
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

/**
 * Takes a snapshot and applies it to the DOM. Rearranges both the contents
 * of the elements in the snapshot as well as putting the elements back into
 * position relative to each other and also makes sure the last element is
 * before the same element as it was when the snapshot was taken.
 * 
 * @param  {snapshot} snapshot
 */
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

/**
 * A snapshot of one or more elements.
 */
export default class ElementSnapshot {

  /**
   * constructor
   * @param  {elements[]} array of element to snapshot. Must be in order.
   * @param  {object} any arbitrary data you want to store with the snapshot
   */
  constructor(els, data) {
    this.snapshot = getSnapshot(els)
    this.data = data
  }

  /**
   * apply the current snapshot to the DOM.
   */
  apply() {
    applySnapshot(this.snapshot)
  }

  /**
   * get the data you passed into the constructor.
   * 
   * @return {object} data
   */
  getData() {
    return this.data
  }
}
