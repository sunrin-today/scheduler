export const env = {
  SCHOOL_NAME: process.env.SCHOOL_NAME,

  INSTAGRAM_USERNAME: process.env.INSTAGRAM_USERNAME,
  INSTAGRAM_PASSWORD: process.env.INSTAGRAM_PASSWORD,

  INTERVAL: process.env.INTERVAL,

  DISCORD_WEBHOOK_URL: process.env.DISCORD_WEBHOOK_URL,

  RANDOM_DELAY: Number(process.env.RANDOM_DELAY),
} as const;
