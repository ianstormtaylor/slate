
import { List, Map } from 'immutable'

/**
 * Group a list of `characters` into ranges by the marks they have.
 *
 * @param {List} characters
 * @return {List} ranges
 */

function groupByMarks(characters) {
  return characters
    .toList()
    .reduce((ranges, char, i) => {
      const { marks, text } = char

      // The first one can always just be created.
      if (i == 0) {
        return ranges.push(new Map({ text, marks }))
      }

      // Otherwise, compare to the previous and see if a new range should be
      // created, or whether the text should be added to the previous range.
      const previous = characters.get(i - 1)
      const prevMarks = previous.marks
      const added = marks.filterNot(mark => prevMarks.includes(mark))
      const removed = prevMarks.filterNot(mark => marks.includes(mark))
      const isSame = !added.size && !removed.size

      // If the marks are the same, add the text to the previous range.
      if (isSame) {
        const index = ranges.size - 1
        let prevRange = ranges.get(index)
        let prevText = prevRange.get('text')
        prevRange = prevRange.set('text', prevText += text)
        return ranges.set(index, prevRange)
      }

      // Otherwise, create a new range.
      return ranges.push(new Map({ text, marks }))
    }, new List())
}

/**
 * Export.
 */

export default groupByMarks
