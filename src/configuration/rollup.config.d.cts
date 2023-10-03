/**
 * Generates configuration for rollup.js. Uses the following environment variables:
 * 
 * - `BUILD_PATH`: Where Babel and `tsc` write their `.js` and `.d.ts` files.
 * - `DIST_PATH`: Where Rollup is to write its distributable output.
 * - `FORMAT`: Type of modules to output; either _'es'_ (ES) or _'cjs'_ (CommonJS).
 * - `SRC_PATH`: Where the original source code is located.
 * 
 * @author Nick Chevsky
 * 
 * @param packageJson - Contents of `package.json` in object form.
 * @returns Rollup configuration which:
 *          - Reads entry points from `package.json`'s `exports` field (no conditionals, null targets, or patterns).
 *          - Writes distributable output to `DIST_PATH`, mirroring the directory structure of `BUILD_PATH`.
 *          - Writes CommonJS modules to `.cjs` files and ES modules to `.js` files.
 *          - Excludes Jest directories `__mocks__`, `__tests__` from the output.
 *          - Copies Sass stylesheets (`.scss`) from `SRC_PATH` to `DIST_PATH`.
 *          - Copies TypeScript type declarations (`.d.ts`) from `BUILD_PATH` to `DIST_PATH`, giving them a `.d.ts`
 *            extension when in ECMAScript mode and a `.d.cts` extension when in CommonJS mode.
 */
export = function (packageJson: {exports: Record<string, Record<string, string> | string>}):
  import('rollup').RollupOptions { /* dummy */ };
