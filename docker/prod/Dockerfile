ARG NODE_VERSION=24.18.0
ARG VITE_BACKEND_API_URL
ARG VITE_SOCKET_SERVICE_URL

FROM node:${NODE_VERSION}-alpine AS builder

ARG VITE_BACKEND_API_URL
ARG VITE_SOCKET_SERVICE_URL

WORKDIR /home/node/app

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
    --mount=type=cache,target=/root/.local/share/pnpm/store \
    corepack enable pnpm && pnpm install --frozen-lockfile

COPY . .

RUN test -n "$VITE_BACKEND_API_URL" && echo "VITE_BACKEND_API_URL=$VITE_BACKEND_API_URL" > .env.production || true && \
    test -n "$VITE_SOCKET_SERVICE_URL" && echo "VITE_SOCKET_SERVICE_URL=$VITE_SOCKET_SERVICE_URL" >> .env.production || true

RUN corepack enable pnpm && pnpm run build


FROM nginx:alpine AS runner

COPY docker/prod/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder --chown=nginx:nginx /home/node/app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
