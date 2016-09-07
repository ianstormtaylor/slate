import assert from 'assert'
import { Selection, Document } from '../../lib'

describe('selection', () => {
  describe('normalize', () => {
    it("works for an empty document", () => {
      const document = Document.create({nodes: []})

      assert.doesNotThrow(() => Selection.create(undefined).normalize(document))
    })
  })
})
