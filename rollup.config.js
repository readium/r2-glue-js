import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

const plugins = [
  resolve(),
  commonjs(),
]

export default [
  {
    input: 'packages/rpc/lib/index.js',
    output: {
      name: 'ReadiumGlueRPC',
      file: './packages/rpc/dist/ReadiumGlue-rpc.js',
      format: 'umd',
      sourcemap: true,
    },
    plugins,
  },
  {
    input: 'packages/shared/lib/index.js',
    output: {
      name: 'ReadiumGlueShared',
      file: './packages/shared/dist/ReadiumGlue-shared.js',
      format: 'umd',
      sourcemap: true,
    },
    plugins,
  },
  {
    input: 'packages/modules/lib/callers.js',
    output: {
      name: 'ReadiumGlueCallers',
      file: './packages/modules/dist/ReadiumGlue-callers.js',
      format: 'umd',
      sourcemap: true,
      globals: {
        '@readium/glue-rpc': 'ReadiumGlueRPC',
        '@readium/glue-shared': 'ReadiumGlueShared',
      },
    },
    external: ['@readium/glue-rpc', '@readium/glue-shared'],
    plugins,
  },
  {
    input: 'packages/modules/lib/services.js',
    output: {
      name: 'ReadiumGlueServices',
      file: './packages/modules/dist/ReadiumGlue-services.js',
      format: 'umd',
      sourcemap: true,
      globals: {
        '@readium/glue-rpc': 'ReadiumGlueRPC',
        '@readium/glue-shared': 'ReadiumGlueShared',
      },
    },
    external: ['@readium/glue-rpc', '@readium/glue-shared'],
    plugins,
  },
];
