module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    '@oit/eslint-config',
  ],
  parserOptions: {
    parser: '@babel/eslint-parser',
  },
  rules: {
    'vuejs-accessibility/click-events-have-key-events': 'off',
    'vuejs-accessibility/mouse-events-have-key-events': 'off',
    'max-lines': ["error", 2000],
    'vue/max-len': ["error", { "code": 200 }]
  },
}
