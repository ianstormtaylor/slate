Suppose you are comparing performance between base branch and feature branch:
1. build the slate packages in the base branch, and save the benchmark result
```
  git checkout base && yarn build && yarn benchmark:save
```
2. build the slate packages in the feature branch, and compare the benchmark with the saved result:
```
  git checkout feature && yarn build && yarn benchmark
```

