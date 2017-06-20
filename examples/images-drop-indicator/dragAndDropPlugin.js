

function dragAndDropPlugin(options) {
  return {
    onDrop(event, data, state, editor) {
      console.log('onDrop: event, data', event.nativeEvent, data)
    },

    onDragOver(event, data, state, editor) {
      console.log('onDragOver: event, data', event.nativeEvent, data)
    }
  }
}

export default dragAndDropPlugin

