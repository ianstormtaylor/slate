export function p(...leaves) {
  return {
    object: 'block',
    type: 'paragraph',
    nodes: [{ object: 'text', leaves }],
  }
}

export function text(text) {
  return { text }
}

export function bold(text) {
  return { text, marks: [{ type: 'bold' }] }
}
