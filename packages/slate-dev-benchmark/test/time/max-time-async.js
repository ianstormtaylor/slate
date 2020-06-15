/* global Promise */
import { Bench } from '../..'
import assert from 'assert'

export const experiment = 'max-time-async'

let index = 0

// A wider range than sync, becuase Promise intialization, babel-node takes time
export function expected() {
  assert(
    index > 5 && index < 12,
    `index should be 10, but is actually ${index}`
  )
  return true
}

export default function(suite) {
  const bench = new Bench(suite, experiment, {
    mode: 'adaptive',
    minTries: 100,
    maxTries: 200,
    minTime: 1,
    maxTime: 100,
    async: true,
  })

  bench.run(
    () => new Promise(resolve => setTimeout(() => resolve(index++), 10))
  )
}
