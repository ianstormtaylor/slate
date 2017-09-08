
import { Block, Character, Document, State, Text } from '../../../../../..'

export default State.create({
  document: Document.create({
    nodes: Block.createList([
      {
        type: 'quote',
        nodes: Block.createList([
          {
            type: 'paragraph',
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
            type: 'paragraph',
            nodes: Block.createList([
              {
                type: 'paragraph',
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
      },
      {
        type: 'quote',
        nodes: Block.createList([
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
          {
            type: 'paragraph',
            nodes: Block.createList([
              {
                type: 'paragraph',
                nodes: Text.createList([
                  {
                    characters: Character.createList([
                      { text: 'f' },
                      { text: 'o' },
                      { text: 'u' },
                      { text: 'r' },
                    ])
                  }
                ])
              }
            ])
          }
        ])
      }
    ])
  })
})
