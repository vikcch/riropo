const path = require('path');

module.exports = {
    configureWebpack: {
        devtool: 'source-map',
        resolve: {
            alias: {
                '@': path.join(__dirname, './src')

            },
            extensions: ['.js', '.vue', '.json']
        }
    },
    productionSourceMap: false,
    publicPath: ''
}