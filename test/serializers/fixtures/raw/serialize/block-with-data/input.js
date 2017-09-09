
import { Block, Character, Document, State, Text } from '../../../../../..'

export default State.create({
  document: Document.create({
    nodes: Block.createList([
      {
        type: 'paragraph',
        data: { key: 'value' },
        nodes: Text.createList([
          {
            characters: Character.createList([
              { text: 'o' },
              { text: 'n' },
              { text: 'e' }
            ])
          }
        ])
      }
    ])
  })
})
