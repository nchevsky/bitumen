module.exports = {
  extends: [
    // https://github.com/facebook/react/blob/main/packages/eslint-plugin-react-hooks/src/index.js
    'plugin:react-hooks/recommended',
    // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/configs/all.js
    'plugin:react/all'
  ],
  rules: {
    // https://github.com/jsx-eslint/eslint-plugin-react#list-of-supported-rules
    'react/boolean-prop-naming': 'off',
    'react/destructuring-assignment': ['error', 'never'],
    'react/forbid-component-props': ['error', {forbid: ['style']}],
    'react/forbid-dom-props': ['error', {forbid: ['style']}],
    'react/function-component-definition': ['error', {unnamedComponents: 'arrow-function'}],
    'react/no-adjacent-inline-elements': 'off',
    'react/no-multi-comp': ['error', {ignoreStateless: true}],
    'react/no-set-state': 'off', // does not apply to function components
    'react/require-default-props': 'off', // too problematic for function, object prop types
    'react/sort-comp': 'off', // does not apply to function components

    // https://github.com/jsx-eslint/eslint-plugin-react#jsx-specific-rules
    'react/jsx-boolean-value': ['error', 'always'],
    'react/jsx-closing-bracket-location': ['error', 'line-aligned'],
    'react/jsx-closing-tag-location': 'off', // until it gains a `line-aligned` knob like `jsx-closing-bracket-location`
    'react/jsx-curly-brace-presence': ['error', {children: 'never', propElementValues: 'always', props: 'never'}],
    'react/jsx-filename-extension': 'off',
    'react/jsx-indent': ['error', 2, {checkAttributes: true, indentLogicalExpressions: true}],
    'react/jsx-indent-props': ['error', 2],
    'react/jsx-key': ['error', {warnOnDuplicates: true}],
    'react/jsx-max-depth': ['error', {max: 8}],
    'react/jsx-max-props-per-line': ['error', {when: 'multiline'}],
    'react/jsx-newline': ['error', {prevent: true}],
    'react/jsx-no-bind': ['error', {allowArrowFunctions: true}],
    'react/jsx-no-leaked-render': 'off', // not type-aware and fails with boolean state variables
    'react/jsx-no-literals': ['error', {ignoreProps: true, noStrings: true}],
    'react/jsx-no-target-blank': ['error', {allowReferrer: true, warnOnSpreadAttributes: true}],
    'react/jsx-no-useless-fragment': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/jsx-tag-spacing': ['error', {beforeClosing: 'never', beforeSelfClosing: 'never'}],
    'react/jsx-wrap-multilines': 'off' // unconditionally enforces parentheses even when redundant
  },
  settings: {
    react: { // https://github.com/jsx-eslint/eslint-plugin-react#configuration-legacy-eslintrc
      version: 'detect'
    }
  }
};
