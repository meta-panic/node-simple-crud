import { resolve as _resolve } from 'path';

export default (env, argv) => {
  const isProduction = argv.mode === 'production';
  const isDevelopment = argv.mode === 'development';

  console.log(`Running Webpack in ${argv.mode} mode.`);

  return {
    mode: argv.mode,
    entry: './src/index.ts',
    output: {
      path: _resolve(__dirname, 'dist'),
      filename: 'bundle.js',
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    }
  };
}; 