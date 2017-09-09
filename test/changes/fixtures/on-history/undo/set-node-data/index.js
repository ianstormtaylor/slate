
export default function (state) {
  const { document } = state

  const next = state
    .change()
    .setNodeByKey(document.nodes.first().key, {
        data: { src: 'world.png' }
    })
    .state

    .change()
    .undo()
    .state

  return next
}
