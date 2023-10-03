/**
 * Babel configuration which:
 * 
 * - Targets:
 *   - the last two versions of Chrome, Edge, Firefox and Safari; and
 *   - maintained versions of Node.js.
 * - Transpiles TypeScript to JavaScript and rewrites import extensions `.?(c|m)ts?(x)` → `.?(c|m)js`.
 * - Enables support for import attributes.
 * - In a Jest environment*, transpiles modules to CommonJS and strips file extensions from imports.
 * - Excludes Jest directories `__mocks__`, `__tests__` when not in a Jest environment*.
 * 
 * (*) For Jest detection, environment variable `ENV` must be set to _'jest'_.
 * 
 * @author Nick Chevsky
 */
/* TODO: `Omit<>` needed to work around error "Declaration emit for this file requires using
         private name 'InputSourceMap' from module '@types/babel__core'. ts(9006)" */
export = {} as Omit<import('@babel/core').TransformOptions, 'inputSourceMap'>;
