import copy from 'rollup-plugin-copy';

const CODE_FILE_EXTENSION = /\.c?js$/;

const passthroughFiles = [];

export default (packageJson) => ({
  input: Object.values(packageJson.exports).reduce((entryPoints, entryPoint) => {
    // if this is a conditional export, use its `import` field as the entry point
    if (typeof entryPoint == 'object') {
      if (typeof entryPoint.import == 'string') {
        entryPoint = entryPoint.import;
      } else {
        return entryPoints;
      }
    }
    // if the entry point is a code file, add it as an input to be processed
    if (entryPoint.match(CODE_FILE_EXTENSION)) {
      entryPoints.push(
        (typeof entryPoint == 'string' ? entryPoint : Object.values(entryPoint).at(0))
          .replace(`/${process.env.DIST_PATH}/`, `/${process.env.BUILD_PATH}/`)
          .replace(CODE_FILE_EXTENSION, '.js') // .cjs → .js
      );
    // otherwise, as long as it is not a directory, queue it to be copied as-is from the source directory
    } else if (!entryPoint.endsWith('/')) {
      passthroughFiles.push(entryPoint.replace(`./${process.env.DIST_PATH}/`, `${process.env.SRC_PATH}/`));
    }
    return entryPoints;
  }, []),
  output: {
    dir: process.env.DIST_PATH,
    entryFileNames: (chunkInfo) => process.env.FORMAT == 'cjs' ? '[name].cjs' : '[name].[ext]',
    esModule: process.env.FORMAT == 'es',
    exports: 'auto',
    format: process.env.FORMAT,
    generatedCode: 'es2015',
    preserveModules: true,
    preserveModulesRoot: process.env.BUILD_PATH
  },
  plugins: [
    copy({
      filter: (src, dest) => !/__.+?__/.exec(src), // exclude Jest mocks and tests
      flatten: false,
      targets: [{
        dest: process.env.DIST_PATH,
        rename: (name, extension, path) => // when in CommonJS mode, (.js, .d.ts]) → (.cjs, .d.cts)
          `${name}.${extension == 'ts' && process.env.FORMAT == 'cjs' ? 'c' : ''}${extension}`,
        src: [
          ...passthroughFiles, // non-code entry points
          `{${process.env.BUILD_PATH},${process.env.SRC_PATH}}/**/*.d.{c,}ts`, // TypeScript declarations
          `${process.env.SRC_PATH}/**/*.scss` // stylesheets
        ]
      }]
    })
  ]
});
