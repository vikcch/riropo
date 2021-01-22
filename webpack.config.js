var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

module.exports = {

    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname + '/dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'src/index.html'
    })],
    devtool: 'source-map',
    resolve: {
        alias: {
            '@': path.join(__dirname, './src')
        },
        extensions: ['.js', '.vue', '.json']
    }
};