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
                test: /\.styl$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'stylus-loader',
                ],
            },
        ],
    },
}