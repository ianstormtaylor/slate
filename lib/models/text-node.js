
import CharacterList from './character-list'
import convertRangesToCharacters from '../utils/convert-ranges-to-characters'
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
    const characters = convertRangesToCharacters(attrs.ranges)
    return new TextNode({
      key: attrs.key,
      characters
    })
  }

}

/**
 * Export.
 */

export default TextNode
