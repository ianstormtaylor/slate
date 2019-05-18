/**
 * Takes a React Synthetic Event or a DOM Event and turns it into a String that
 * is easy to log. It's succinct and keeps info to a bare minimum.
 *
 * @param {Event} event
 */

export default function stringifyEvent(event) {
  const e = event.nativeEvent || event

  switch (e.type) {
    case 'keydown':
      return `${e.type} ${JSON.stringify(e.key)}`
    case 'input':
    case 'beforeinput':
    case 'textInput':
      return `${e.type}:${e.inputType} ${JSON.stringify(e.data)}`
    default:
      return e.type
  }
}
