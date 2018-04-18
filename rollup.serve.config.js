import config from './rollup.config';
import serve from 'rollup-plugin-serve';

export default  {
  ...config,
  plugins: [
    ...config.plugins,
    serve({
      // Launch in browser (default: false)
      open: true,

      // Multiple folders to serve from
      contentBase: ['.', 'examples/base'],

      // Options used in setting up server
      host: '0.0.0.0',
      port: 8080,

      headers: {
        'Cache-Control': 'no-cache, must-revalidate',
      },
    }),
  ],
};
