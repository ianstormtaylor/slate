
import Character from './character'
import { List } from 'immutable'

/**
 * Character list.
 */

class CharacterList extends List {

  static create(attrs = []) {
    attrs = attrs.map(character => Character.create(character))
    return new CharacterList(attrs)
  }

}

/**
 * Export.
 */

export default CharacterList
