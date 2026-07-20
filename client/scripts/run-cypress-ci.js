const { spawnSync } = require('child_process');

const env = { ...process.env };
delete env.ELECTRON_RUN_AS_NODE;

const result = spawnSync(
  process.execPath,
  [require.resolve('cypress/bin'), 'run', '--headless', '--browser', 'chrome'],
  { env, stdio: 'inherit' },
);

if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
