module.exports = {
    entry: './src/app.js',
    output: {
        filename: './dst/bundle.js',
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015'],
                plugins: ['syntax-async-functions', 'transform-regenerator'],
            },
        }, {
            test: /\.json$/,
            loader: 'json',
        }],
    },
};
