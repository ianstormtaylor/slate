
import MarkList from './mark-list'
import { Record } from 'immutable'

/**
 * Record.
 */

const CharacterRecord = new Record({
  text: '',
  marks: new MarkList()
})

/**
 * Character.
 */

class Character extends CharacterRecord {

  static create(attrs) {
    return new Character({
      text: attrs.text,
      marks: MarkList.create(attrs.marks)
    })
  }

}

/**
 * Export.
 */

export default Character
