
import { Block, Character, Document, State, Text } from '../../../../../..'

export default State.create({
  document: Document.create({
    nodes: Block.createList([
      {
        type: 'paragraph',
        nodes: Text.createList([
          {
            characters: Character.createList([
              { text: 'o' },
              { text: 'n' },
              { text: 'e' },
            ])
          }
        ])
      },
      {
        type: 'paragraph',
        nodes: Text.createList([
          {
            characters: Character.createList()
          }
        ])
      },
      {
        type: 'paragraph',
        nodes: Text.createList([
          {
            characters: Character.createList([
              { text: 't' },
              { text: 'h' },
              { text: 'r' },
              { text: 'e' },
              { text: 'e' },
            ])
          }
        ])
      },
    ])
  })
})
