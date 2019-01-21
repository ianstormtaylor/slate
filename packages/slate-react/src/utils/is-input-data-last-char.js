/**
 * In Android sometimes the only way to tell what the user is trying to do
 * is to look at an event's `data` property and see if the last characters
 * matches a character. This method helps us make that determination.
 *
 * @param {String} data
 * @param {[String]} chars
 * @return {Boolean}
 */

export default function isInputDataLastChar(data, chars) {
  if (!Array.isArray(chars))
    throw new Error(`chars must be an array of one character strings`)
  if (data == null) return false
  const lastChar = data[data.length - 1]
  return chars.includes(lastChar)
}
