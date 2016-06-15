
import CharacterList from './character-list'
import { Record } from 'immutable'

/**
 * Record.
 */

const TextNodeRecord = new Record({
  key: null,
  characters: new CharacterList()
})

/**
 * TextNode.
 */

class TextNode extends TextNodeRecord {

  static create(attrs) {
    const characters = attrs.ranges.reduce((characters, range) => {
      const chars = range.text
        .split('')
        .map(char => {
          return {
            text: char,
            marks: range.marks
          }
        })
      return characters.concat(chars)
    }, [])

    return new TextNode({
      key: attrs.key,
      characters: CharacterList.create(characters)
    })
  }

}

/**
 * Export.
 */

export default TextNode
