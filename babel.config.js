const stringKey = 'node_modules\\mocha\\bin\\mocha';
const isMochaTests = process.argv.some(v => v.endsWith(stringKey));

// https://stackoverflow.com/questions/61749854/babel-config-js-vs-babelrc-vue-express-in-same-directory

// NOTE:: Anteriormente tinha dois files de configuração do babel:
// * .babelrc
// * babel.config.js
// Ambos o "mocha" e o "vue-cli-service serve" carregavam os dois files

if (isMochaTests) {

  // ? mocha

  // Conteudo do json que estave em .babelrc
  module.exports = {
    presets: ["@babel/preset-env"],
    plugins: [
      "@babel/plugin-proposal-class-properties",
      "@babel/plugin-transform-runtime",
      ["babel-plugin-webpack-aliases", { config: "./webpack.config.js" }]
    ]
  }

  // @vue/cli-plugin-unit-mocha
  // https://cli.vuejs.org/core-plugins/unit-mocha.html
  // Funciona bem 'out of the box'com import e @alias, não consegui debugar como queria...
  // Dá para debugar com `debugger;` no file, mas vai para um script babelado criado...
  // Breakpoints só nesse file babelado

  // Artigo util:
  // https://www.dotnetcurry.com/vuejs/1441/vuejs-unit-testing


} else {

  // ? vue-cli-service serve

  module.exports = {
    presets: [
      '@vue/cli-plugin-babel/preset'
    ]
  }
}

