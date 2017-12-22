# Local dev installation and usage instructions.

Installation of the development version of slate locally, and usage within local projects should be done as follows.

Assuming that one wants to use a local development version of slate in a local javascript project `myProject` with the local directory structure:

```
.../dev/
.../dev/myProject
```

first switch to the directory `.../dev/` and run the following commands to get the source code:

```
git clone git@github.com:humandx/slate.git
cd slate
git checkout <dev branch>
```

where `<dev branch>` is the branch one wants to incorporate into `myProject`. The directory structure should now look like:


```
.../dev/
.../dev/myProject/
.../dev/slate/
```

 Next we need to build the library. Run:

```
yarn install
yarn run build:packeages
```

Next, we need to point `myProject` to the local files. Edit `.../dev/myProject/package.json` with the following modifications:

- `"slate": <version number>` -> `"slate": "file:../slate/packages/slate/"`
- `"slate-react: <version number>` -> `"slate-react": "file:../slate/packages/slate-react/"`
- `"slate-plain-serializer": <version number>` -> `"slate-plain-serializer": "file:../slate/packages/slate-plain-serializer"`
- etc.

Finally, you should clean `myProject` by running `npm run clean` or `rm -rf node_modules` within `.../dev/myProject` followed by a fresh `npm install`.