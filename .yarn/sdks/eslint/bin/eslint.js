#!/usr/bin/env node

const { existsSync } = require("fs");
const { createRequire, register } = require("module");
const { resolve } = require("path");
const { pathToFileURL } = require("url");

// Define paths
const PNP_API_PATH = resolve(__dirname, "../../../../.pnp.cjs");
const PNP_LOADER_PATH = resolve(PNP_API_PATH, "../.pnp.loader.mjs");
const USER_WRAPPER_PATH = resolve(__dirname, "./sdk.user.cjs");

const requireFromPnp = createRequire(PNP_API_PATH);
const isPnpAvailable = existsSync(PNP_API_PATH);
const isPnpLoaderEnabled = existsSync(PNP_LOADER_PATH);
const isUserWrapperAvailable = existsSync(USER_WRAPPER_PATH);

//setup PnP environment If required
if (isPnpAvailable && !process.versions.pnp) {
  require(PNP_API_PATH).setup();

  if (isPnpLoaderEnabled && register) {
    register(pathToFileURL(PNP_LOADER_PATH));
  }
}

//   apply user wrapper if It exists
const wrapWithUserWrapper = isUserWrapperAvailable
  ? exports => requireFromPnp(USER_WRAPPER_PATH)(exports)
  : exports => exports;

// export ESLint from the appropriate Location
module.exports = wrapWithUserWrapper(requireFromPnp("eslint/bin/eslint.js"));

