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
    'vue/component-tags-order': [
      'error', {
        order: ['template', 'script', 'style'],
      },
    ],
    'arrow-parens': 'off',
  },
}
