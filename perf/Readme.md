# Benchmarks

This folder contains a set of benchmarks used to compare performances between Slate's version. We use [BenchmarkJS](https://benchmarkjs.com/) to measure performances.

## Running the benchmark

The following command will make sure to compile Slate before running the benchmarks.

```
npm run perf
```

You can skip Slate's compilation by running directly

```
npm run benchmarks
```

### Comparing results

You can save the results of the benchmarks with:

```shell
npm run perf:save
```

The results are saved as JSON in `./perf/reference.json`. You can then checkout a different implementation, and run a comparison benchmark with the usual command:

```
npm run perf
```

`perf` and `benchmarks` automatically look for an existing `reference.json` to use for comparison.

### Understanding the results

Each benchmark prints its results, showing:
- The number of **operation per second**. This is the relevant value, that must be compared with values from different implementation.
- The **number of samples** run. BenchmarkJS has a special heuristic to choose how many samples must be made. The results are more accurate with a high number of samples. Low samples count is often tied with high relative margin of error
- The **relative margin** of error for the measure. The lower the value, the more accurate the results are. When compared with previous results, we display the average relative margin of error.
- (comparison only) A **comparison** of the two implementation, according to BenchmarkJS. It can be Slower, Faster, or Indeterminate.
- (comparison only) The **difference** in operations per second. Expressed as a percentage of the reference.

## Writing a benchmark

To add a benchmark, create a new folder in the `perf/benchmarks/` directory. It must contain two files:

1. `input.yaml` to provide an initial State
2. `index.js` to tell what to run

`index.js` must export a `run(state)` function. This whole function will be benchmarked. It will be run several times, with the parsed state from `input.yaml` as parameter. You can optionally export a `setup(state) -> state` function, to modify the state parsed from `input.yaml`.

Note 1: Everything must be sync.

Note 2: To avoid unwanted memoization, a different instance of `state` will be passed for every `run` call.

## Detailed options for the benchmark script

You can also launch the benchmark script directly. See usage:

``` shell
babel-node ./perf/index.js -h
```
