/**
 * Generates `@typescript-eslint` overrides for a given set of ESLint core rules.
 * 
 * @param {import('eslint').Linter.RulesRecord} rules Object whose keys are the names of core rules to override, and
 *                                                    each value either a severity level or severity + options array.
 * @returns {import('eslint').Linter.RulesRecord} Object with two rules for each rule given in `rules`:
 *                                                1. the overridden ESLint core rule set to _'off'_, and
 *                                                2. the overriding `@typescript-eslint` rule with the given severity
 *                                                   level and any options.
 */
function overrideForTypeScript(rules) {
  return Object.fromEntries(Object.entries(rules).reduce(
    (/** @type {Array<[string, import('eslint').Linter.RuleEntry]>} */ overrides, [name, options]) => {
      overrides.push([name, 'off'], [`@typescript-eslint/${name}`, options]);
      return overrides;
    },
    []
  ));
}

/** @type {import('eslint').Linter.Config} */
const configuration = {
  env: {es6: true, node: true},
  extends: [
    // https://github.com/eslint/eslint/blob/v8.x/packages/js/src/configs/eslint-recommended.js
    'eslint:recommended',
    // https://github.com/un-ts/eslint-plugin-import-x/blob/master/src/config/recommended.ts
    'plugin:import-x/recommended',
    // https://github.com/un-ts/eslint-plugin-import-x/blob/master/src/config/typescript.ts
    'plugin:import-x/typescript'
  ],
  ignorePatterns: ['**/build', '**/dist'],
  overrides: [
    // ESM
    {
      files: ['*.@(j|t)s?(x)'], // *.js, *.jsx, *.ts, *.tsx
      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-commonjs.md
      rules: {'import-x/no-commonjs': 'error'}
    },
    // indices
    {
      files: ['index.*'],
      rules: {
        // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/prefer-default-export.md
        'import-x/prefer-default-export': 'off' // `export {default as foo} from 'foo';`
      }
    },
    // Jest/Vitest mocks
    {
      env: {jest: true},
      files: ['**/__mocks__/**'],
      rules: {
        // dynamic importing of manual mocks precludes static analysis of unused exports
        // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-unused-modules.md
        'import-x/no-unused-modules': ['error', {missingExports: true, unusedExports: false}],
        // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/prefer-default-export.md
        'import-x/prefer-default-export': 'off'
      }
    },
    // Jest/Vitest tests
    {
      env: {jest: true},
      files: ['**/__tests__/**'],
      rules: {
        // function stubs that return static values
        // https://eslint.org/docs/latest/rules/class-methods-use-this
        'class-methods-use-this': 'off'
      }
    },
    // JSX
    {
      files: ['*.@(j|t)sx'], // .jsx, .tsx
      rules: {
        // https://eslint.org/docs/latest/rules/multiline-ternary
        'multiline-ternary': 'off' // clashes with `react/jsx-indent` which in turn clashes with `indent`
      }
    },
    // TypeScript
    {
      // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/src/configs
      extends: ['plugin:@typescript-eslint/strict-type-checked', 'plugin:@typescript-eslint/stylistic-type-checked'],
      files: ['*.?(c)ts?(x)'],
      parserOptions: { // https://typescript-eslint.io/packages/parser/#configuration
        ecmaVersion: 'latest',
        project: true
      },
      rules: {
        //==============================================================================================================
        // @typescript-eslint/eslint-plugin <https://typescript-eslint.io/rules/>
        //==============================================================================================================

        // extended ESLint core rules
        ...overrideForTypeScript({
          'brace-style': ['error', '1tbs', {allowSingleLine: true}],
          'comma-dangle': 'error',
          'comma-spacing': 'error',
          'func-call-spacing': 'error',
          indent: ['error', 2, {
            SwitchCase: 1,
            ignoredNodes: [
              'ClassDeclaration',
              'TSIntersectionType',
              'TSTypeAnnotation',
              'TSTypeParameterInstantiation',
              'TSUnionType'
            ],
            offsetTernaryExpressions: true
          }],
          'key-spacing': 'error',
          'keyword-spacing': 'error',
          'lines-between-class-members': ['error', 'always', {exceptAfterSingleLine: true}],
          'no-extra-semi': 'error',
          'no-invalid-this': 'error',
          'no-loop-func': 'error',
          'no-loss-of-precision': 'error',
          'no-redeclare': 'error',
          'no-unused-expressions': 'error',
          'no-unused-vars': ['warn', {args: 'none'}],
          'no-use-before-define': ['error', {functions: false}],
          'object-curly-spacing': ['error', 'never'],
          quotes: ['error', 'single', {avoidEscape: true}],
          semi: 'error',
          'space-before-blocks': 'error',
          'space-before-function-paren': ['error', {
            anonymous: 'always', asyncArrow: 'always', named: 'never'
          }],
          'space-infix-ops': ['error', {int32Hint: true}]
        }),

        // native rules
        '@typescript-eslint/array-type': ['error', {default: 'generic'}],
        '@typescript-eslint/consistent-indexed-object-style': 'off',
        '@typescript-eslint/consistent-type-exports': ['error', {fixMixedExportsWithInlineTypeSpecifier: true}],
        '@typescript-eslint/consistent-type-imports': ['error', {
          disallowTypeAnnotations: false, fixStyle: 'inline-type-imports'
        }],
        '@typescript-eslint/no-confusing-void-expression': ['error', {ignoreArrowShorthand: true}],
        '@typescript-eslint/no-duplicate-type-constituents': 'error',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-extraneous-class': 'off',
        '@typescript-eslint/no-import-type-side-effects': 'error',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-unnecessary-parameter-property-assignment': 'error', // since v7.16.0
        '@typescript-eslint/no-unsafe-unary-minus': 'error',
        '@typescript-eslint/no-useless-empty-export': 'error',
        '@typescript-eslint/parameter-properties': 'error',
        '@typescript-eslint/prefer-find': 'error',
        '@typescript-eslint/prefer-nullish-coalescing': 'off',
        '@typescript-eslint/prefer-string-starts-ends-with': ['error', {allowSingleElementEquality: 'always'}],
        '@typescript-eslint/prefer-ts-expect-error': 'off', // deprecated subset of `ban-ts-comment`
        '@typescript-eslint/promise-function-async': 'error',
        '@typescript-eslint/restrict-template-expressions': 'off',
        '@typescript-eslint/switch-exhaustiveness-check': ['error', {
          allowDefaultCaseForExhaustiveSwitch: false, requireDefaultForNonUnion: true
        }],
        '@typescript-eslint/unified-signatures': ['error', {ignoreDifferentlyNamedParameters: true}]
      }
    },
    // Jest/Vitest tests
    {
      files: ['**/__tests__/*.?(c)ts?(x)'],
      rules: {
        // function stubs that do nothing
        // https://typescript-eslint.io/rules/no-empty-function/
        '@typescript-eslint/no-empty-function': 'off',
        // e.g. `jest.fn<void, […]>(…)` -- rule option `allowInGenericTypeArguments` doesn't apply to function calls;
        //                                 see https://github.com/typescript-eslint/typescript-eslint/issues/8113
        // https://typescript-eslint.io/rules/no-invalid-void-type/
        '@typescript-eslint/no-invalid-void-type': 'off',
        // e.g. `expect(object).toEqual({foo: expect.any(Function)})` -- `expect.any()` returns `any`
        // https://typescript-eslint.io/rules/no-unsafe-assignment/
        '@typescript-eslint/no-unsafe-assignment': 'off',
        // e.g. `expect(object.method).toHaveBeenCalled()`
        // https://typescript-eslint.io/rules/unbound-method/
        '@typescript-eslint/unbound-method': 'off'
      }
    }
  ],
  parserOptions: { // https://eslint.org/docs/latest/user-guide/configuring/language-options#specifying-parser-options
    ecmaVersion: 'latest'
  },
  reportUnusedDisableDirectives: true,
  root: true,
  rules: {
    //==================================================================================================================
    // eslint <https://eslint.org/docs/latest/rules>
    //==================================================================================================================

    // possible problems
    'no-constant-binary-expression': 'error',
    'no-new-native-nonconstructor': 'error',
    'no-self-compare': 'error',
    'no-template-curly-in-string': 'error',
    'no-unreachable-loop': 'error',
    'no-unused-private-class-members': 'error',
    'no-unused-vars': ['warn', {args: 'none'}],
    'no-use-before-define': ['error', {functions: false}],

    // suggestions
    'arrow-body-style': 'error',
    'block-scoped-var': 'error',
    camelcase: 'error',
    'class-methods-use-this': 'error',
    curly: ['error', 'multi-line'],
    'default-case-last': 'error',
    'grouped-accessor-pairs': 'error',
    'guard-for-in': 'error',
    'logical-assignment-operators': ['error', 'always', {enforceForIfStatements: true}],
    'new-cap': ['error', {capIsNewExceptionPattern: 'able$'}],
    'no-alert': 'error',
    'no-else-return': 'error',
    'no-empty-static-block': 'error',
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
    'no-new-wrappers': 'error',
    'no-object-constructor': 'error', // since v8.50.0
    'no-octal-escape': 'error',
    'no-redeclare': 'error',
    'no-return-assign': 'error',
    'no-script-url': 'error',
    'no-undef-init': 'error',
    'no-underscore-dangle': ['error', {
      allow: ['__typename'], allowInArrayDestructuring: false, allowInObjectDestructuring: false
    }],
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
    'max-statements-per-line': ['error', {max: 2}],
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
    'yield-star-spacing': ['error', 'before'],

    //==================================================================================================================
    // eslint-plugin-import-x <https://github.com/un-ts/eslint-plugin-import-x#rules>
    //==================================================================================================================

    'import-x/exports-last': 'error',
    'import-x/extensions': ['error', 'ignorePackages', {ts: 'ignore', tsx: 'ignore'}],
    'import-x/first': 'error',
    'import-x/newline-after-import': 'error',
    'import-x/no-absolute-path': 'error',
    'import-x/no-amd': 'error',
    'import-x/no-deprecated': 'warn',
    'import-x/no-dynamic-require': 'error',
    'import-x/no-extraneous-dependencies': 'error',
    'import-x/no-import-module-exports': 'error',
    'import-x/no-mutable-exports': 'error',
    'import-x/no-named-default': 'error',
    'import-x/no-namespace': 'error',
    'import-x/no-relative-packages': 'error',
    'import-x/no-self-import': 'error',
    'import-x/no-unassigned-import': ['error', {allow: ['**/*.?(s)css']}],
    'import-x/no-unresolved': ['error', {commonjs: true}],
    'import-x/no-useless-path-segments': ['error', {commonjs: true}],
    'import-x/no-webpack-loader-syntax': 'error',
    'import-x/order': ['error', {
      alphabetize: {order: 'asc'},
      groups: ['builtin', 'external', 'internal'],
      'newlines-between': 'always',
      warnOnUnassignedImports: true
    }],
    'import-x/prefer-default-export': 'error'
  },
  settings: {
    //==================================================================================================================
    // eslint-plugin-import-x <https://github.com/un-ts/eslint-plugin-import-x#settings>
    //==================================================================================================================
    'import-x/resolver': {
      // https://github.com/import-js/eslint-import-resolver-typescript -- supports `import-x` since v3.6.2
      typescript: {}
    }
  }
};

// must be exported in a separate statement in order for `tsc` to preserve JSDoc
module.exports = configuration;
