const path = require('path');

const crypto = require('crypto');

// NOTE:: Regredi para v14.17.1, fica na mesma... (retirar quando actualizar vue)
/**
 * The MD4 algorithm is not available anymore in Node.js 17+ (because of library SSL 3).
 * In that case, silently replace MD4 by the MD5 algorithm.
 */
try {
    crypto.createHash('md4');
} catch (e) {
    console.warn('Crypto "MD4" is not supported anymore by this Node.js version');
    const origCreateHash = crypto.createHash;
    crypto.createHash = (alg, opts) => {
        return origCreateHash(alg === 'md4' ? 'md5' : alg, opts);
    };
}

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