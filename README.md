# Overview

`bitumen` is a collection of utilities, types, and opinionated configuration for Babel, ESLint, Rollup, TypeScript, and Vitest.

# Supported Environments

- Client side: Last two versions of Chrome, Edge, Firefox (+ ESR), and Safari
- Server side: Maintained versions of Node.js

# Usage

## Configuration

### Babel

- Targets maintained versions of Node.js and the last two versions of Chrome, Edge, Firefox (+ ESR), and Safari;
- transpiles TypeScript to JavaScript and rewrites import extensions `.?(c|m)ts?(x)` → `.?(c|m)js`;
- preserves ECMAScript modules (i.e. no CommonJS conversion); and
- enables support for import attributes.

#### Option 1: 📍 `package.json`

```json
{
  "babel": {
    "extends": "bitumen/configuration/babel"
  }
}
```

#### Option 2: 📍 `babel.config.js`

```js
import base from 'bitumen/configuration/babel';

export default {
  ...base,
  // custom configuration and overrides
};
```

### ESLint

Configuration for JavaScript, TypeScript, and optionally React, based on:

| Plugin | Preset(s) |
| --- | --- |
| [`@eslint/js`](https://eslint.org/docs/latest/rules/) | `recommended` |
| [`@typescript-eslint`](https://typescript-eslint.io/rules/) | `strict-type-checked`, `stylistic-type-checked` |
| [`eslint-plugin-import-x`](https://github.com/un-ts/eslint-plugin-import-x#rules) | `recommended`, `typescript` |
| [`eslint-plugin-react`](https://www.npmjs.com/package/eslint-plugin-react) | `all` |
| [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) | `recommended` |

📍 `.eslintrc.cjs`

```js
const base = require('bitumen/configuration/eslint');
const react = require('bitumen/configuration/eslint-react');

/** @type {import('eslint').Linter.Config} */
module.exports = {
  ...base,
  ...react,
  // custom configuration and overrides
};
```

### Rollup

📍 `rollup.config.js`

```js
import configure from 'bitumen/configuration/rollup';

import packageJson from './package.json';

export default configure(packageJson);
```

`configure()` returns a configuration object which:
- Reads entry points from `package.json`'s `exports` field (no conditionals, null targets, or patterns).
- Writes distributable output to `DIST_PATH`, mirroring the directory structure of `BUILD_PATH`.
- Writes CommonJS modules to `.cjs` files and ES modules to `.js` files.
- Excludes test directories `__mocks__`, `__tests__` from the output.
- Copies Sass stylesheets (`.scss`) from `SRC_PATH` to `DIST_PATH`.
- Copies TypeScript type declarations (`.d.ts`) from `BUILD_PATH` to `DIST_PATH`, giving them a `.d.ts` extension for ESM and a `.d.cts` extension for CommonJS.

The following environment variables must be set at runtime:

- `BUILD_PATH`: Where Babel and `tsc` output files can be found.
- `DIST_PATH`: Where Rollup is to write its distributable output.
- `FORMAT`: Type of modules to output; either _'es'_ (ESM) or _'cjs'_ (CommonJS).
- `SRC_PATH`: Where the original source code is located.

### TypeScript

📍 `tsconfig.json`

```jsonc
{
  "extends": "bitumen/configuration/typescript",
  // custom configuration and overrides
}
```

### Vitest

- Automatically clears mocks after each test,
- enables globals for automatic DOM clean-up between UI tests,
- looks for tests and mocks under `./src`,
- requires 100% `istanbul` coverage,
- turns off watch mode by default, and
- uses thread workers for reduced overhead.

📍 `vitest.config.js`

```js
import base from 'bitumen/configuration/vitest';

/** @type {import('vitest/config').UserConfig} */
export default {
  ...base,
  // custom configuration and overrides
};
```

## Library

`bitumen` exposes named exports from the following entry points:

- `collections`
- `configuration`
- `mixins`
- `types`
- `utils`

For example, to implement `SortedSet` from `collections`:
```js
import {SortedSet} from 'bitumen/collections';

const set = new SortedSet();
```

# Type Declarations

For proper module and type resolution, set option `compilerOptions.module` to _'NodeNext'_ in `jsconfig.json` or `tsconfig.json`.

💡 `bitumen`'s [TypeScript configuration](#typescript) is already set up this way.
