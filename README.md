# Overview

`bitumen` is a collection of classes, types, utilities, and opinionated configuration for Babel, ESLint, JavaScript, rollup.js, and TypeScript.

# Supported Environments

- Client side: Last two versions of Chrome, Edge, Firefox (+ ESR), and Safari
- Server side: Maintained versions of Node.js

# Usage

## Configuration

### Babel

#### Option 1: 📍 `package.json`

```json
{
  "babel": {
    "extends": "bitumen/configuration/babel"
  }
}
```

#### Option 2: 📍 `babel.config.cjs`

```js
const base = require('bitumen/configuration/babel');

module.exports = {
  ...base,
  // custom configuration and overrides
};
```

### ESLint

📍 `.eslintrc.cjs`

```js
const base = require('bitumen/configuration/eslint');
const react = require('bitumen/configuration/eslint-react');

module.exports = {
  ...base,
  ...react,
  // custom configuration and overrides
};
```

### rollup.js

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
- Excludes Jest directories `__mocks__`, `__tests__` from the output.
- Copies Sass stylesheets (`.scss`) from `SRC_PATH` to `DIST_PATH`.
- Copies TypeScript type declarations (`.d.ts`) from `BUILD_PATH` to `DIST_PATH`, giving them a `.d.ts` extension for ECMAScript and a `.d.cts` extension for CommonJS.

The following environment variables must be set at runtime:

- `BUILD_PATH`: Where Babel and `tsc` write their `.js` and `.d.ts` files.
- `DIST_PATH`: Where rollup.js is to write its distributable output.
- `FORMAT`: Type of modules to output; either _'es'_ (ES) or _'cjs'_ (CommonJS).
- `SRC_PATH`: Where the original source code is located.

### TypeScript

📍 `jsconfig.json`

```jsonc
{
  "extends": "bitumen/configuration/javascript"
}
```

📍 `tsconfig.json`

```jsonc
{
  "extends": "bitumen/configuration/typescript",
  // `exclude`, `files`, and `include` paths must be set locally;
  // see https://github.com/microsoft/TypeScript/issues/45050
  "include": ["./src/"]
}
```

## Library

`bitumen` exposes named exports from the following entry points:

- `collections`
- `mixins`
- `types`
- `utils`

For example, to implement `SortedSet` from `collections`:
```js
import {SortedSet} from 'bitumen/collections';

const set = new SortedSet();
```

# Type Declarations

For proper module and type resolution, use the following project settings:

📍 `jsconfig.json`
```jsonc
{
  "compilerOptions": {
    "checkJs": true,
    "moduleResolution": "NodeNext",
    "strictNullChecks": true // optional but recommended
  }
}
```

📍 `tsconfig.json`
```jsonc
{
  "compilerOptions": {
    "moduleResolution": "NodeNext"
  }
}
```

💡 `bitumen`'s [JavaScript and TypeScript configurations](#typescript) are already set up this way.
