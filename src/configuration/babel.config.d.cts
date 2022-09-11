/**
 * Babel configuration which:
 * 
 * - Targets 1️⃣ the last two versions of Chrome, Edge, Firefox and Safari and 2️⃣ maintained
 *   versions of Node.js, injecting core-js polyfills as needed.
 * - Transpiles TypeScript to JavaScript.
 * - Enables support for import assertions.
 * - In a Jest environment*, transpiles modules to CommonJS and strips file extensions from imports.
 * - Excludes Jest directories `__mocks__`, `__tests__` when not in a Jest environment*.
 * 
 * (*) For Jest detection, environment variable `ENV` must be set to _'jest'_.
 * 
 * @author Nick Chevsky
 */
export = Record<string, any>;
