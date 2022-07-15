import path from 'path'

export default {
    watch: true,
    entry: [
        path.resolve('./src/js/brktfldg.js'),
    ],
    output: {
        path: path.resolve('./dist'),
        filename: 'brktfldg.min.js',
        library: {
            name: 'brktfldg',
            type: 'umd',
        }
    },
}