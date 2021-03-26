var path = require('path');

module.exports = {

    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    },
    devtool: 'source-map',
    resolve: {
        alias: {
            '@': path.join(__dirname, './src')
        },
        extensions: ['.js', '.vue', '.json']
    },
    target: "node",
    mode: 'none',
    externals: [/node_modules/, 'bufferutil', 'utf-8-validate'],
};