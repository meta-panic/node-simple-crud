import { fileURLToPath } from "url";
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default () => {
    return {
        entry: './src/index.ts',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'bundle.js',
            module: true,
            library: {
                type: 'module',
            },
        },
        experiments: {
            outputModule: true,
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: 'ts-loader',
                    exclude: [/node_modules/, /\.(test)\.ts$/]
                },
            ],
        },
        resolve: {
            extensions: ['.ts', '.js'],
        },
        target: 'node',
    };
};
