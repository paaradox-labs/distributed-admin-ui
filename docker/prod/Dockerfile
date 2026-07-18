ARG NODE_VERSION=24.18.0

FROM node:${NODE_VERSION}-alpine AS builder

WORKDIR /home/node/app

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
    --mount=type=cache,target=/root/.local/share/pnpm/store \
    corepack enable pnpm && pnpm install --frozen-lockfile

COPY . .

RUN corepack enable pnpm && pnpm run build


FROM nginx:alpine AS runner

COPY --from=builder --chown=nginx:nginx /home/node/app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
