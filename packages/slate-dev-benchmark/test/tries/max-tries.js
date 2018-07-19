import { Bench } from '../..'

export const experiment = 'max-tries adaptive mode'
export const actual = { index: 0 }
export const expected = { index: 200 }

export default function(suite) {
  const bench = new Bench(suite, experiment, {
    mode: 'adaptive',
    minTries: 100,
    maxTries: 200,
    minTime: 100,
    maxTime: Infinity,
  })

  bench.run(() => {
    actual.index++
  })
}
