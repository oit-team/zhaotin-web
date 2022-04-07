module.exports = {
  extends: [
    'stylelint-config-recommended-scss',
    'stylelint-config-recommended-vue/scss',
  ],
  overrides: [
    {
      files: [
        '*.vue',
        '**/*.vue',
        '**/*.scss',
      ],
      rules: {
        // 允许未知@
        'scss/at-rule-no-unknown': null,
        // 最大嵌套层级
        'max-nesting-depth': 5,
        // 缩进
        indentation: 2,
        // 允许空源
        'no-empty-source': null,
        // 允许最大行数
        'max-lines': ["error", 2000]
      },
    },
  ],
}
