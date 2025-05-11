import { resolve as _resolve } from 'path';

const __dirname = import.meta.dirname;

export default (env, argv) => {
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