FROM node:23-bookworm-slim AS builder

ENV TZ=Asia/Seoul
RUN apt-get update && apt-get install -y tzdata python3 python3-pip python3-requests python3-pillow \
    && ln -sf /usr/share/zoneinfo/$TZ /etc/localtime \
    && echo $TZ > /etc/timezone

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm --activate
RUN pnpm install --frozen-lockfile

COPY . .

CMD ["pnpm", "run", "start"]