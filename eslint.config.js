// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig({
  ...expoConfig,
  env: {
    jest: true, // <-- Jest erkennen
    node: true,
    browser: true,
  },
  ignorePatterns: ["dist/*"], // <-- "ignores" heißt korrekt "ignorePatterns"
});
