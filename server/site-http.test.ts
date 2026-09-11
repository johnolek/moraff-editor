import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createRunServer } from './http';
import { pageOf } from './site';
import type { Sql } from './sql';
import { openTestDatabase } from './test-sql';

const PAGE = Buffer.from('<!doctype html><title>Moraff Tools</title>');

describe('the tools served from the run server', () => {
  let sql: Sql;
  let withPage: Server;
  let withoutPage: Server;
  let served: string;
  let bare: string;

  beforeAll(async () => {
    sql = await openTestDatabase();
    withPage = createRunServer({ allowedOrigin: 'https://johnolek.github.io' }, sql, undefined, pageOf(PAGE));
    withoutPage = createRunServer({ allowedOrigin: 'https://johnolek.github.io' }, sql);
    await new Promise<void>((resolve) => withPage.listen(0, '127.0.0.1', resolve));
    await new Promise<void>((resolve) => withoutPage.listen(0, '127.0.0.1', resolve));
    served = `http://127.0.0.1:${(withPage.address() as AddressInfo).port}`;
    bare = `http://127.0.0.1:${(withoutPage.address() as AddressInfo).port}`;
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      withPage.close((thrown) => (thrown ? reject(thrown) : resolve()));
    });
    await new Promise<void>((resolve, reject) => {
      withoutPage.close((thrown) => (thrown ? reject(thrown) : resolve()));
    });
    await sql.close();
  });

  it('answers the root with the page it was given', async () => {
    const response = await fetch(`${served}/`);

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('text/html; charset=utf-8');
    expect(await response.text()).toBe(PAGE.toString());
  });

  it('names the page in a tag, and asks a browser to check that tag every time', async () => {
    const response = await fetch(`${served}/`);

    expect(response.headers.get('etag')).toBe(pageOf(PAGE).tag);
    expect(response.headers.get('cache-control')).toBe('no-cache');
  });

  it('sends nothing to a browser that has the page already', async () => {
    const response = await fetch(`${served}/`, { headers: { 'If-None-Match': pageOf(PAGE).tag } });

    expect(response.status).toBe(304);
    expect(await response.text()).toBe('');
  });

  it('sends the page to a browser holding an older one', async () => {
    const response = await fetch(`${served}/`, { headers: { 'If-None-Match': pageOf(Buffer.from('older')).tag } });

    expect(response.status).toBe(200);
    expect(await response.text()).toBe(PAGE.toString());
  });

  it('still says 404 for an endpoint there is not', async () => {
    const response = await fetch(`${served}/leaderboards`);

    expect(response.status).toBe(404);
  });

  it('leaves the root a 404 on a server carrying no page', async () => {
    const response = await fetch(`${bare}/`);

    expect(response.status).toBe(404);
  });

  it('answers its endpoints whether it carries a page or not', async () => {
    for (const origin of [served, bare]) {
      const response = await fetch(`${origin}/health`);

      expect(response.status).toBe(200);
      expect((await response.json()).ok).toBe(true);
    }
  });
});
