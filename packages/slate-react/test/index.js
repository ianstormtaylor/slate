import { KeyUtils } from 'slate'

beforeEach(KeyUtils.resetGenerator)

describe('slate-react', () => {
  require('./plugins')
  require('./rendering')
  require('./utils')
})
