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

## Understanding the results

Each benchmark prints its results, showing:
* The number of operation per second. This is the relevant value, that must be compared with values from different implementation.
* The relative margin of error for the measure. The lower the value, the more accurate the results are.

## Comparing results

You can save the results of the benchmarks with:

```shell
npm run perf:save
```

The results are saved as JSON in `./perf/reference.json`. You can then checkout a different implementation, and run a comparison benchmark with the usual command:

```
npm run perf
```

`perf` and `benchmarks` automatically look for an existing `reference.json` to use for comparison.

