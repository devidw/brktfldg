import path from 'path'

export default {
    output: {
        path: path.resolve('./dist'),
        filename: 'brktfldg.min.js',
        library: {
            name: 'brktfldg',
            type: 'umd',
        }
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