/** @type {import('jest').Config} */
const config = {
  verbose: true,
  setupFiles: [
    './jest/config.dev.js',
  ],
};

module.exports = config;
