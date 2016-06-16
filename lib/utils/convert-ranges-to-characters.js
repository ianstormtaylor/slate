
import CharacterList from '../models/character-list'

/**
 * Convert a `characters` list to `ranges`.
 *
 * @param {CharacterList} characters
 * @return {Array} ranges
 */

export default function convertRangesToCharacters(ranges) {
  return CharacterList.create(ranges.reduce((characters, range) => {
    const chars = range.text
      .split('')
      .map(char => {
        return {
          text: char,
          marks: range.marks
        }
      })
    return characters.concat(chars)
  }, []))
}
