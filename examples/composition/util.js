export function p(...leaves) {
  return {
    object: 'block',
    type: 'paragraph',
    nodes: [{ object: 'text', leaves }],
  }
}

export function text(textContent) {
  return { text: textContent }
}

export function bold(textContent) {
  return { text: textContent, marks: [{ type: 'bold' }] }
}
