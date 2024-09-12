//======================================================================================================================
// For now, this must be a CommonJS module. ECMAScript modules cause @babel/eslint-parser to become
// asynchronous, which ESLint does not support: https://github.com/eslint/eslint/discussions/14295
//======================================================================================================================

/** @type {import('@babel/core').TransformOptions} */
const configuration = {
  plugins: ['@babel/plugin-syntax-import-attributes'],
  presets: [
    ['@babel/preset-env', {
      corejs /* since v7.4.0 */: 3,
      modules: false /* preserve ESM */,
      targets: [
        'last 2 Chrome versions',
        'last 2 Edge versions',
        'last 2 Firefox versions, Firefox ESR',
        'last 2 Safari versions',
        'maintained node versions'
      ],
      useBuiltIns: 'usage'
    }],
    ['@babel/preset-typescript', {
      allowDeclareFields /* since v7.7.0 */: true, // TODO: will become default in Babel 8
      rewriteImportExtensions /* since v7.23.0 */: true // .?(c|m)ts?(x) → .?(c|m)js
    }]
  ]
};

// must be exported in a separate statement in order for `tsc` to preserve JSDoc
module.exports = configuration;
