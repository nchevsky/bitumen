//======================================================================================================================
// For now, this must be a CommonJS module. ECMAScript modules cause @babel/eslint-parser to become
// asynchronous, which ESLint does not support: https://github.com/eslint/eslint/discussions/14295
//======================================================================================================================

module.exports = {
  plugins: [
    ['@babel/plugin-syntax-import-attributes', {deprecatedAssertSyntax: true}],
    process.env.ENV == 'jest' && ['replace-import-extension', {extMapping: {'.js': '', '.jsx': ''}}]
  ].filter(Boolean),
  presets: [
    ['@babel/preset-env', {
      corejs: 3,
      modules: process.env.ENV == 'jest' ? 'auto' : false,
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
      allowDeclareFields: true // TODO: will be enabled by default in Babel 8
    }]
  ]
};
