import { Bench } from '../..'
import { syncSleep } from '../utils/sleep'
import assert from 'assert'

export const experiment = 'max-time'

let index = 0

export function expected() {
  assert(
    index > 85 && index < 115,
    `index should be around 100, but is actually ${index}`
  )
  return true
}

export default function(suite) {
  const bench = new Bench(suite, experiment, {
    mode: 'adaptive',
    minTries: 1000,
    maxTries: 2000,
    minTime: 1,
    maxTime: 1000,
    async: false,
  })

  bench.run(() => {
    syncSleep(10)
    index++
  })
}
