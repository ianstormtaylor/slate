// In Android API 26 and 27 we can tell if the input key was pressed by
// waiting for the `beforeInput` event and seeing that the last character
// of its `data` property is `10`.
//
// Note that at this point it is too late to prevent the event from affecting
// the DOM so we use other methods to clean the DOM up after we have detected
// the input.
export default function isInputDataEnter(data) {
  if (data == null) return false
  const lastChar = data[data.length - 1]
  const charCode = lastChar.charCodeAt(0)
  return charCode === 10
}
