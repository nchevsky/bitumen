/**
 * Generates `@typescript-eslint` overrides for a given set of ESLint core rules.
 * 
 * @param {Record<string, Array | string>} rules - Object whose keys are the names of core rules to override, and
 *                                                 each value either a severity level or a severity + options array.
 * @returns {Record<string, Array | string>} Object with two rules for each rule given in `rules`:
 *                                           1. the overridden ESLint core rule set to _'off'_, and
 *                                           2. the overriding `@typescript-eslint` rule with the given severity
 *                                             level and any options.
 */
function overrideForTypeScript(rules) {
  return Object.fromEntries(Object.entries(rules).reduce((overrides, [name, options]) => {
    overrides.push([name, 'off'], [`@typescript-eslint/${name}`, options]);
    return overrides;
  }, []));
}

module.exports = {
  env: {es6: true, node: true},
  extends: [
    'eslint:recommended', // https://github.com/eslint/eslint/blob/main/packages/js/src/configs/eslint-recommended.js
    'plugin:import/recommended' // https://github.com/import-js/eslint-plugin-import/blob/main/config/recommended.js
  ],
  ignorePatterns: ['**/build', '**/dist'],
  overrides: [
    // ESM
    {
      files: ['*.@(j|t)s?(x)'], // *.js, *.jsx, *.ts, *.tsx
      rules: {'import/no-commonjs': 'error'}
    },
    // indices
    {
      files: ['index.*'],
      rules: {
        'import/prefer-default-export': 'off' // `export {default as foo} from 'foo';`
      }
    },
    // Jest mocks
    {
      env: {jest: true},
      files: ['**/__mocks__/*'],
      rules: {
        'import/no-unused-modules': ['error', {missingExports: true}]
      }
    },
    // Jest tests
    {
      env: {jest: true},
      files: ['**/__tests__/*'],
      rules: {
        'class-methods-use-this': 'off',
        'no-new': 'off'
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
      // https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/src/configs/strict.ts
      extends: 'plugin:@typescript-eslint/strict',
      files: ['*?(.d).?(c)ts?(x)'],
      parserOptions: { // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/parser#configuration
        ecmaVersion: 'latest',
        project: ['./tsconfig.json']
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
          'no-duplicate-imports': 'error',
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
        '@typescript-eslint/consistent-type-exports': ['error', {fixMixedExportsWithInlineTypeSpecifier: true}],
        '@typescript-eslint/consistent-type-imports': ['error', {
          disallowTypeAnnotations: false, fixStyle: 'inline-type-imports'
        }],
        '@typescript-eslint/naming-convention': 'off', // TODO
        '@typescript-eslint/no-duplicate-type-constituents': 'error',
        '@typescript-eslint/no-extraneous-class': 'off',
        '@typescript-eslint/no-import-type-side-effects': 'error',
        '@typescript-eslint/promise-function-async': 'error',
        '@typescript-eslint/unified-signatures': ['error', {ignoreDifferentlyNamedParameters: true}],

        //==============================================================================================================
        // eslint-plugin-import <https://github.com/import-js/eslint-plugin-import#rules>
        //==============================================================================================================

        'import/named': 'off' // redundant for TypeScript
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
    'no-duplicate-imports': 'error',
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
    'no-new-object': 'error',
    'no-new-wrappers': 'error',
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
    // eslint-plugin-import <https://github.com/import-js/eslint-plugin-import#rules>
    //==================================================================================================================

    'import/exports-last': 'error',
    'import/extensions': ['error', 'ignorePackages', {ts: 'ignore', tsx: 'ignore'}],
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-absolute-path': 'error',
    'import/no-amd': 'error',
    'import/no-deprecated': 'warn',
    'import/no-dynamic-require': 'error',
    'import/no-extraneous-dependencies': 'error',
    'import/no-import-module-exports': 'error',
    'import/no-mutable-exports': 'error',
    'import/no-named-default': 'error',
    'import/no-namespace': 'error',
    'import/no-relative-packages': 'error',
    'import/no-self-import': 'error',
    'import/no-unassigned-import': ['error', {allow: ['**/*.?(s)css']}],
    'import/no-unresolved': ['error', {commonjs: true}],
    'import/no-useless-path-segments': ['error', {commonjs: true}],
    'import/no-webpack-loader-syntax': 'error',
    'import/order': ['error', {
      alphabetize: {order: 'asc'},
      groups: ['builtin', 'external', 'internal'],
      'newlines-between': 'always',
      warnOnUnassignedImports: true
    }],
    'import/prefer-default-export': 'error'
  },
  settings: {
    //==================================================================================================================
    // eslint-plugin-import <https://github.com/import-js/eslint-plugin-import#settings>
    //==================================================================================================================
    'import/extensions': ['.cjs', '.cts', '.d.cts', '.d.ts', '.d.tsx', '.js', '.json', '.jsx', '.ts', '.tsx'],
    'import/external-module-folders': ['node_modules', 'node_modules/@types'],
    'import/resolver': {
      'babel-module': {}, // https://github.com/tleunen/eslint-import-resolver-babel-module
      typescript: {} // https://github.com/import-js/eslint-import-resolver-typescript
    }
  }
};
