FROM node:23-bookworm-slim AS builder

ENV TZ=Asia/Seoul
RUN apt-get update && apt-get install -y tzdata python3 python3-pip \
    && ln -sf /usr/share/zoneinfo/$TZ /etc/localtime \
    && echo $TZ > /etc/timezone

WORKDIR /app
COPY package.json yarn.lock ./
RUN corepack enable && corepack prepare yarn --activate
RUN yarn install --frozen-lockfile

COPY . .

CMD ["yarn", "start"]