// The site and the run server together, for playing against the server on this machine.
//
// The server runs from its build rather than from source, so it is built first, along with the
// engine of this commit, which the server publishes into Postgres when it starts. The database
// is created if it is missing. Both processes go down together on Ctrl-C.
import { execFileSync, spawn } from 'node:child_process';
import { userInfo } from 'node:os';

const database = process.env.DATABASE_URL ?? `postgres://${userInfo().username}@127.0.0.1:5432/moraff_runs`;
const port = process.env.RUN_SERVER_PORT ?? '3580';

function run(command, args) {
  execFileSync(command, args, { stdio: 'inherit' });
}

function createDatabaseIfMissing() {
  const name = new URL(database).pathname.slice(1);
  try {
    run('createdb', [name]);
    console.log(`Created the database ${name}.`);
  } catch {
    // createdb fails when the database already exists, which is the usual case.
  }
}

createDatabaseIfMissing();
run('pnpm', ['build:server']);
run('pnpm', ['build:engine']);

const server = spawn('node', ['dist-server/main.mjs'], {
  stdio: 'inherit',
  env: { ...process.env, DATABASE_URL: database, RUN_SERVER_PORT: port },
});
const site = spawn('pnpm', ['dev'], {
  stdio: 'inherit',
  env: { ...process.env, VITE_RUN_SERVER: `http://localhost:${port}` },
});

function stopBoth() {
  server.kill('SIGTERM');
  site.kill('SIGTERM');
}
process.on('SIGINT', stopBoth);
process.on('SIGTERM', stopBoth);
server.on('exit', (code) => {
  if (code !== 0 && code !== null) {
    console.error(`The run server stopped with code ${code}.`);
    site.kill('SIGTERM');
  }
});
site.on('exit', () => server.kill('SIGTERM'));
