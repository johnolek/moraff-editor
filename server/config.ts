/**
 * What the run server needs to know about the box it is running on. All of it comes from the
 * environment, so a deploy is a unit file with a few variables in it and nothing to edit in the
 * repository.
 */
export interface ServerConfig {
  /** The port to answer HTTP on. John's reverse proxy is what the public reaches. */
  port: number;
  /** The one SQLite file everything is kept in. */
  databasePath: string;
  /** The deployed site's origin, which the browser has to be told may read the answers. */
  allowedOrigin: string;
  /** The directory of engine builds, one per commit deployed, that runs are replayed with. */
  enginesPath: string;
}

/** Claude's own range is 3500-3599; John assigns the port the server really runs on. */
const DEFAULT_PORT = 3580;

const DEFAULT_DATABASE_PATH = './server/data/runs.sqlite';

const DEFAULT_ENGINES_PATH = './server/engines';

/** The GitHub Pages site these tools are deployed to. */
const DEFAULT_ALLOWED_ORIGIN = 'https://johnolek.github.io';

export function configFromEnvironment(environment: NodeJS.ProcessEnv = process.env): ServerConfig {
  return {
    port: portFrom(environment.RUN_SERVER_PORT),
    databasePath: environment.RUN_SERVER_DATABASE ?? DEFAULT_DATABASE_PATH,
    allowedOrigin: environment.RUN_SERVER_ORIGIN ?? DEFAULT_ALLOWED_ORIGIN,
    enginesPath: environment.RUN_SERVER_ENGINES ?? DEFAULT_ENGINES_PATH,
  };
}

function portFrom(value: string | undefined): number {
  if (value === undefined) return DEFAULT_PORT;
  const port = Number(value);
  if (!Number.isInteger(port) || port < 0 || port > 65535) {
    throw new Error(`RUN_SERVER_PORT is not a port number: ${value}`);
  }
  return port;
}
