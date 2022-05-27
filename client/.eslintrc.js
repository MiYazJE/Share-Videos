module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:react-hooks/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  settings: {
    plugins: [
      'react',
    ],
    'import/resolver': {
      node: {
        paths: ['./'],
      },
    },
  },
  rules: {
    'react/prop-types': 0,
    'consistent-return': 0,
    'no-shadow': 0,
    'react/jsx-props-no-spreading': 0,
    'react/no-array-index-key': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'react/no-this-in-sfc': 1,
    'default-param-last': 0,
    'import/prefer-default-export': 0,
    'no-unused-vars': 1,
    'linebreak-style': 0,
    'react/react-in-jsx-scope': 0,
  },
};
