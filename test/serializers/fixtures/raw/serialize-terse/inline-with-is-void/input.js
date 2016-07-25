
import { Block, Character, Document, Inline, Mark, State, Text } from '../../../../../..'

export default State.create({
  document: Document.create({
    nodes: Block.createList([
      {
        type: 'paragraph',
        nodes: Inline.createList([
          {
            type: 'link',
            isVoid: true,
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
      }
    ])
  })
})
