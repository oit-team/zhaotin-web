module.exports = {
  extends: [
    '@oit/eslint-config',
  ],
  rules: {
    'vue/component-tags-order': [
      'error', {
        order: ['template', 'script', 'style'],
      },
    ],
    'arrow-parens': 'off',
    'vue/custom-event-name-casing': 'off',
  },
}
