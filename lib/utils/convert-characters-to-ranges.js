
import xor from 'lodash/xor'

/**
 * Convert a `characters` list to `ranges`.
 *
 * @param {CharacterList} characters
 * @return {Array} ranges
 */

export default function convertCharactersToRanges(characters) {
  return characters
    .toArray()
    .reduce((ranges, char, i) => {
      const previous = i == 0 ? null : characters.get(i - 1)
      const { text } = char
      const marks = char.marks.toArray().map(mark => mark.type)

      if (previous) {
        const previousMarks = previous.marks.toArray().map(mark => mark.type)
        const diff = xor(marks, previousMarks)
        if (!diff.length) {
          const previousRange = ranges[ranges.length - 1]
          previousRange.text += text
          return ranges
        }
      }

      const offset = ranges.map(range => range.text).join('').length
      ranges.push({ text, marks, offset })
      return ranges
    }, [])
}
