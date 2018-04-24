Original repo https://github.com/ianstormtaylor/slate

This repo is used to fork the following packages:

* slate (alias slate-core)
* slate-react

Each of them has a corresponding GitbookIO/repository containing the Git history for the package only. These single-package repositories are synched to a corresponding branch on this repo. To achieve this, we use `splitsh` https://github.com/lerna/lerna/pull/1033#issuecomment-335894690

To build and publish our forks to GitHub, run `node publish.js`.

In this forked monorepo, the dependencies to our forked packages use GitHub URLs as explaine here https://github.com/lerna/lerna#git-hosted-dependencies

To publish
