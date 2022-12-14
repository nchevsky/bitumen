# Overview

`bitumen` is a collection of utility classes, types, and opinionated configurations for Babel, ESLint, rollup.js, and TypeScript.

# Supported Environments

- Client-side use: Last two versions of Chrome, Edge, Firefox, or Safari
- Server-side use: Node.js v14+

# Installation

๐ก Install the package as a runtime dependency.

```shell
$ npm install bitumen
```

# Usage

`bitumen` exposes named exports from the following entry points:

- `collections`
- `configuration`
- `mixins`
- `types`

For example, to implement the `SortedSet` class from the `collections` entry point:
```js
import {SortedSet} from 'bitumen/collections';

const set = new SortedSet();
```

# Type Declarations

TypeScript type declarations are included to aid in writing type-safe codeโeven in JavaScript projects. ๐

## Importing in Visual Studio Code

### JavaScript Projects
๐ `jsconfig.json` (create as needed)
```jsonc
{
  "compilerOptions": {
    "checkJs": true, // optional but recommended
    "moduleResolution": "NodeNext"
  }
}
```

### TypeScript Projects
๐ `tsconfig.json`
```jsonc
{
  "compilerOptions": {
    "moduleResolution": "NodeNext"
  }
}
```
