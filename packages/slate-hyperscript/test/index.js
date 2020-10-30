import { resolve } from 'path'
import { fixtures } from '../../../support/fixtures'

describe('slate-hyperscript', () => {
  fixtures(resolve(__dirname, 'fixtures'), ({ module }) => {
    const { input, output } = module
    let actual = {}

    if (Array.isArray(output)) {
      actual = output
    } else {
      for (const key in output) {
        actual[key] = input[key]
      }
    }

    expect(actual).toEqual(output)
  })
})
