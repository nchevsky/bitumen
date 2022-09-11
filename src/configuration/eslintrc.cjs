/**
 * Overrides an ESLint rule with its \@typescript-eslint equivalent.
 * 
 * @param {string} name - Name of the base ESLint rule to be overridden.
 * @param {Array | string} options - Options to set on the overriding \@typescript-eslint rule.
 * @returns {Record<string, Array | string>} Object with two rules:
 *                                           - the overridden ESLint rule set to _'off'_, and
 *                                           - the overriding \@typescript-eslint rule with the given `options`.
 */
function overrideESLintRule(name, options) {
  return {[name]: 'off', [`@typescript-eslint/${name}`]: options};
}

module.exports = {
  env: {node: true},
  extends: 'eslint:recommended',
  ignorePatterns: ['**/build', '**/dist'],
  overrides: [
    // common
    {
      env: {'shared-node-browser': true},
      files: ['./*']
    },
    // Jest
    {
      env: {jest: true},
      files: ['**/__mocks__/*', '**/__tests__/*'],
      rules: {'class-methods-use-this': 'off', 'no-new': 'off'}
    },
    // TypeScript
    {
      extends: 'plugin:@typescript-eslint/strict',
      files: ['*.ts', '*.tsx'],
      parserOptions: {project: ['./tsconfig.json']},
      rules: {
        // ESLint rules with @typescript-eslint overrides
        ...overrideESLintRule('brace-style', ['error', '1tbs', {allowSingleLine: true}]),
        ...overrideESLintRule('comma-dangle', 'error'),
        ...overrideESLintRule('comma-spacing', 'error'),
        ...overrideESLintRule('func-call-spacing', 'error'),
        ...overrideESLintRule('indent', ['error', 2, {
          SwitchCase: 1, ignoredNodes: ['ClassDeclaration', 'TSUnionType'], offsetTernaryExpressions: true
        }]),
        ...overrideESLintRule('keyword-spacing', 'error'),
        ...overrideESLintRule('lines-between-class-members', ['error', 'always', {exceptAfterSingleLine: true}]),
        ...overrideESLintRule('no-duplicate-imports', 'error'),
        ...overrideESLintRule('no-extra-semi', 'error'),
        ...overrideESLintRule('no-invalid-this', 'error'),
        ...overrideESLintRule('no-loop-func', 'error'),
        ...overrideESLintRule('no-loss-of-precision', 'error'),
        ...overrideESLintRule('no-redeclare', 'error'),
        ...overrideESLintRule('no-unused-expressions', 'error'),
        ...overrideESLintRule('no-unused-vars', ['error', {args: 'none'}]),
        ...overrideESLintRule('no-use-before-define', 'error'),
        ...overrideESLintRule('object-curly-spacing', ['error', 'never']),
        ...overrideESLintRule('quotes', ['error', 'single', {avoidEscape: true}]),
        ...overrideESLintRule('semi', 'error'),
        ...overrideESLintRule('space-before-blocks', 'error'),
        ...overrideESLintRule('space-before-function-paren', ['error', {
          anonymous: 'always', asyncArrow: 'always', named: 'never'
        }]),
        ...overrideESLintRule('space-infix-ops', ['error', {int32Hint: true}]),

        // rules native to @typescript-eslint
        '@typescript-eslint/array-type': ['error', {default: 'generic'}],
        '@typescript-eslint/no-extraneous-class': 'off',
        '@typescript-eslint/unified-signatures': ['error', {ignoreDifferentlyNamedParameters: true}]
      }
    }
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  reportUnusedDisableDirectives: true,
  root: true,
  rules: {
    // possible problems
    'no-constant-binary-expression': 'error',
    'no-duplicate-imports': 'error',
    'no-self-compare': 'error',
    'no-template-curly-in-string': 'error',
    'no-unreachable-loop': 'error',
    'no-unused-private-class-members': 'error',
    'no-unused-vars': ['error', {args: 'none'}],
    'no-use-before-define': 'error',

    // suggestions
    'arrow-body-style': 'error',
    'block-scoped-var': 'error',
    camelcase: ['error', {allow: ['^SoftLayer_']}],
    'class-methods-use-this': 'error',
    curly: ['error', 'multi-line'],
    'default-case-last': 'error',
    'grouped-accessor-pairs': 'error',
    'guard-for-in': 'error',
    'new-cap': ['error', {capIsNewExceptionPattern: 'able$'}],
    'no-alert': 'error',
    'no-else-return': 'error',
    'no-eq-null': 'error',
    'no-eval': 'error',
    'no-extra-label': 'error',
    'no-implicit-globals': 'error',
    'no-invalid-this': 'error',
    'no-label-var': 'error',
    'no-lone-blocks': 'error',
    'no-lonely-if': 'error',
    'no-loop-func': 'error',
    'no-mixed-operators': 'error',
    'no-new': 'error',
    'no-new-func': 'error',
    'no-new-object': 'error',
    'no-new-wrappers': 'error',
    'no-octal-escape': 'error',
    'no-redeclare': 'error',
    'no-return-assign': 'error',
    'no-script-url': 'error',
    'no-undef-init': 'error',
    'no-underscore-dangle': 'error',
    'no-unneeded-ternary': 'error',
    'no-unused-expressions': 'error',
    'no-useless-call': 'error',
    'no-useless-computed-key': 'error',
    'no-useless-concat': 'error',
    'no-useless-rename': 'error',
    'no-useless-return': 'error',
    'no-var': 'error',
    'no-warning-comments': 'warn',
    'object-shorthand': 'error',
    'operator-assignment': 'error',
    'prefer-arrow-callback': 'error',
    'prefer-const': 'error',
    'prefer-exponentiation-operator': 'error',
    'prefer-numeric-literals': 'error',
    'prefer-object-has-own': 'error',
    'prefer-object-spread': 'error',
    'prefer-promise-reject-errors': 'error',
    'prefer-regex-literals': 'error',
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
    'prefer-template': 'error',
    'quote-props': ['error', 'as-needed'],
    'sort-keys': ['error', 'asc', {allowLineSeparatedGroups: true}],
    'sort-vars': 'error',
    'spaced-comment': ['warn', 'always', {exceptions: ['-', '=']}],
    yoda: 'error',

    // layout & formatting
    'array-bracket-newline': ['error', 'consistent'],
    'array-bracket-spacing': 'error',
    'array-element-newline': ['error', 'consistent'],
    'arrow-spacing': 'error',
    'block-spacing': 'error',
    'brace-style': ['error', '1tbs', {allowSingleLine: true}],
    'comma-dangle': 'error',
    'comma-spacing': 'error',
    'comma-style': 'error',
    'computed-property-spacing': 'error',
    'dot-location': ['error', 'property'],
    'eol-last': 'error',
    'func-call-spacing': 'error',
    'function-call-argument-newline': ['error', 'consistent'],
    'function-paren-newline': ['error', 'multiline-arguments'],
    'generator-star-spacing': 'error',
    indent: ['error', 2, {SwitchCase: 1, offsetTernaryExpressions: true}],
    'jsx-quotes': 'error',
    'key-spacing': 'error',
    'keyword-spacing': 'error',
    'linebreak-style': 'error',
    'lines-between-class-members': ['error', 'always', {exceptAfterSingleLine: true}],
    'max-len': ['error', {code: 120}],
    'max-statements-per-line': 'error',
    'multiline-ternary': ['error', 'always-multiline'],
    'new-parens': 'error',
    'no-multi-spaces': 'error',
    'no-multiple-empty-lines': 'error',
    'no-tabs': 'error',
    'no-trailing-spaces': ['error', {ignoreComments: true}],
    'no-whitespace-before-property': 'error',
    'nonblock-statement-body-position': 'error',
    'object-curly-newline': 'error',
    'object-curly-spacing': ['error', 'never'],
    'object-property-newline': ['error', {allowAllPropertiesOnSameLine: true}],
    'operator-linebreak': ['error', 'before'],
    'padded-blocks': ['error', 'never'],
    quotes: ['error', 'single', {avoidEscape: true}],
    'rest-spread-spacing': 'error',
    semi: 'error',
    'semi-spacing': 'error',
    'semi-style': 'error',
    'space-before-blocks': 'error',
    'space-before-function-paren': ['error', {anonymous: 'always', asyncArrow: 'always', named: 'never'}],
    'space-in-parens': 'error',
    'space-infix-ops': ['error', {int32Hint: true}],
    'space-unary-ops': 'error',
    'switch-colon-spacing': 'error',
    'template-curly-spacing': 'error',
    'template-tag-spacing': 'error',
    'unicode-bom': 'error',
    'wrap-iife': ['error', 'inside'],
    'yield-star-spacing': ['error', 'before']
  }
};
