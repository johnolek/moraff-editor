# The run server as Coolify deploys it: one image carrying the built server, the tools it serves
# at its root, and a build of the engine for the commit the image was made from, which the server
# puts in Postgres as it starts. One commit is all three. `server/README.md` is the rest of the
# deploy.

FROM node:24-slim AS build

# There is no repository in the build context for git to be asked the commit, so the builds read
# it here instead; Coolify passes the commit it checked out under this name.
ARG SOURCE_COMMIT
ENV SOURCE_COMMIT=${SOURCE_COMMIT}

# The site is a static page, so the address of the run server it talks to is fixed when the page
# is built rather than read when the page is opened. A build given none has no Boards tab and
# sends nothing anywhere, which is a working image with half the site missing.
ARG VITE_RUN_SERVER
ENV VITE_RUN_SERVER=${VITE_RUN_SERVER}

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build:server && pnpm build:engine && pnpm build

FROM node:24-slim

WORKDIR /app

# The server looks for an engine build at `../server/engines/<commit>/engine.mjs` and for the page
# it serves at `../dist/index.html`, both beside itself, so all three keep the place the
# repository has them in. The server bundle imports nothing but Node's own modules, which is why
# no package.json and no node_modules come with it.
COPY --from=build /app/dist-server ./dist-server
COPY --from=build /app/server/engines ./server/engines
COPY --from=build /app/dist ./dist

USER node
EXPOSE 3580

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD ["node", "--eval", "fetch(`http://127.0.0.1:${process.env.RUN_SERVER_PORT ?? 3580}/health`).then((answer) => process.exit(answer.ok ? 0 : 1), () => process.exit(1))"]

CMD ["node", "dist-server/main.mjs"]
