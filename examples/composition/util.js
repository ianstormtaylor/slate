export function p(...leaves) {
  return {
    object: 'block',
    type: 'paragraph',
    nodes: leaves,
  }
}

export function text(textContent) {
  return { object: 'text', text: textContent }
}

export function bold(textContent) {
  return { object: 'text', text: textContent, marks: [{ type: 'bold' }] }
}
