// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2, // 규칙을 오류로 설정
      'always',
      ['feat', 'fix', 'docs', 'style', 'refact', 'test', 'cicd', 'chore', 'setting'],
    ],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'subject-empty': [2, 'never'],
  },
};
