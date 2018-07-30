import { KeyUtils } from 'slate'

describe('slate-react', () => {
  beforeEach(KeyUtils.resetGenerator)

  require('./plugins')
  require('./rendering')
  require('./utils')
})
