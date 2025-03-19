FROM node:23-bookworm-slim AS builder

ENV TZ=Asia/Seoul
RUN apt-get update && apt-get install -y tzdata \
    && ln -sf /usr/share/zoneinfo/$TZ /etc/localtime \
    && echo $TZ > /etc/timezone

WORKDIR /app
COPY package.json yarn.lock ./
RUN corepack enable && corepack prepare yarn --activate
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

FROM node:23-bookworm-slim AS final

ENV TZ=Asia/Seoul
RUN apt-get update && apt-get install -y tzdata \
    && ln -sf /usr/share/zoneinfo/$TZ /etc/localtime \
    && echo $TZ > /etc/timezone

WORKDIR /app
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/dist dist

USER node

CMD ["node", "dist/index.js"]