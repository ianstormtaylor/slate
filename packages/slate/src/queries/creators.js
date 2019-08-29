export const createPoint = (fn, editor) => props => {
  const { value: { document } } = editor
  const point = document.createPoint(props)
  return point
}
