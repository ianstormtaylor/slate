import { KeyUtils } from 'slate'

describe('utils', () => {
  beforeEach(KeyUtils.resetGenerator)
  require('./get-children-decorations')
})
