Original repo https://github.com/ianstormtaylor/slate

This repo is used to fork the following packages:

* slate (alias slate-core)
* slate-react

Each of them has a corresponding GitbookIO/repository containing the Git history for the package only. These single-package repositories are synched to a corresponding branch on this repo. To achieve this, we use `splitsh` https://github.com/lerna/lerna/pull/1033#issuecomment-335894690

In this forked monorepo, the dependencies to our forked packages use GitHub URLs as explained here https://github.com/lerna/lerna#git-hosted-dependencies This required us to upgrade to lerna v3-Beta.

To build and publish our forks to GitHub:

1. Make sure that you have the branch `slate-core`, `slate-react` etc. locally
2. Make sure that you defined the corresponding remote. Ex: `git remote add slate-core git@github.com:GitbookIO/slate-core.git`.
3. Bump versions of the changed packages (using `lerna publish`) and commit.
4. Run `node publish.js` to build, update repos, and tag.
