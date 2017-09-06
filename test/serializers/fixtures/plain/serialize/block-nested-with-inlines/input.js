
import { Block, Character, Document, Inline, State, Text } from '../../../../../..'

export default State.create({
  document: Document.create({
    nodes: Block.createList([
      {
        type: 'paragraph',
        nodes: Inline.createList([
          {
            type: 'link',
            nodes: Text.createList([
              {
                characters: Character.createList([
                  { text: 'o' },
                  { text: 'n' },
                  { text: 'e' }
                ])
              }
            ])
          },
          {
            type: 'link',
            nodes: Text.createList([
              {
                characters: Character.createList([
                  { text: 't' },
                  { text: 'w' },
                  { text: 'o' }
                ])
              }
            ])
          }
        ])
      }
    ])
  })
})
