import { Bench } from '../..'
import { syncSleep } from '../utils/sleep'
import assert from 'assert'

export const experiment = 'max-time'

let index = 0

export function expected() {
  assert(index === 10, `index should be 10, but is actually ${index}`)
  return true
}

export default function(suite) {
  const bench = new Bench(suite, experiment, {
    mode: 'adaptive',
    minTries: 100,
    maxTries: 200,
    minTime: 1,
    maxTime: 100,
    async: false,
  })

  bench.run(() => {
    syncSleep(10)
    index++
  })
}
