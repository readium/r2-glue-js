import typescript2 from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import serve from 'rollup-plugin-serve';
import path from 'path';

const pkg = require('./package.json');

const plugins = [resolve(), commonjs(), typescript2()];

const baseReceiverInput = './src/lib/receiver.ts';

const buildReceiverEntry = (input, name, exportName) => {
  return {
    input,
    output: {
      file: `./dist/modules/ReadiumGlue-${name}.js`,
      format: 'iife',
      name: `ReadiumGlue.${exportName}`,
      sourcemap: true,
      globals: {
        [path.resolve(baseReceiverInput)]: 'ReadiumGlue',
      },
    },
    external: [path.resolve(baseReceiverInput)],
    plugins,
  };
};

export default [
  {
    input: baseReceiverInput,
    output: {
      file: './dist/modules/ReadiumGlue-base.js',
      format: 'iife',
      name: 'ReadiumGlue',
      sourcemap: true,
    },
    plugins,
  },
  buildReceiverEntry(
    './src/modules/event-handling/receiver.ts',
    'event-handling',
    'EventHandlingReceiver',
  ),
  {
    input: './src/senders.ts',
    output: [
      {
        file: pkg.main,
        format: 'umd',
        name: 'ReadiumGlue',
        sourcemap: true,
      },
    ],
    plugins,
  },
  {
    input: './src/receivers.ts',
    output: [
      {
        file: './dist/ReadiumGlue-receivers.js',
        format: 'iife',
        name: 'ReadiumGlue',
        sourcemap: true,
      },
    ],
    plugins: process.env.SERVE
      ? [
          ...plugins,
          serve({
            // Launch in browser (default: false)
            open: true,

            // Multiple folders to serve from
            contentBase: ['.', 'examples/demo'],

            // Options used in setting up server
            host: '0.0.0.0',
            port: 8080,

            headers: {
              'Cache-Control': 'no-cache, must-revalidate',
            },
          }),
        ]
      : plugins,
  },
];
