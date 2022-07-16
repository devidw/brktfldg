import path from 'path'

export default {
    experiments: {
        outputModule: true,
    },
    output: {
        path: path.resolve('./dist'),
        filename: 'brktfldg.js',
        library: {
            type: 'module',
        },
    },
    module: {
        rules: [
            {
                test: /\.sass$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ],
            },
        ],
    },
}