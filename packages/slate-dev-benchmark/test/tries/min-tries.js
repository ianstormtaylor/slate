import { Bench } from '../..'

export const experiment = 'min-tries static mode'
export const actual = { index: 0 }
export const expected = { index: 100 }

export default function(suite) {
  const bench = new Bench(suite, experiment, {
    mode: 'static',
    minTries: 100,
    maxTries: 200,
    minTime: 100,
  })

  bench.run(() => {
    actual.index++
  })
}
