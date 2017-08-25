
export default function (state) {
  const { document } = state

  const next = state
    .transform()
    .setNodeByKey(document.nodes.first().key, {
        data: { src: 'world.png' }
    })
    .state

    .transform()
    .undo()
    .state

  return next
}
