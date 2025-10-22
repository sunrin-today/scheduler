import { env } from "../constants/env";
import { WebhookConfig } from "../types/service/webhook";

const WEBHOOK_AUTHOR_NAME = "선린투데이";
const WEBHOOK_AUTHOR_AVATAR_URL =
  "https://avatars.githubusercontent.com/u/166101514";

export function sendWebhook({
  content,
  embeds,
  name = WEBHOOK_AUTHOR_NAME,
  avatar_url = WEBHOOK_AUTHOR_AVATAR_URL,
}: WebhookConfig) {
  fetch(env.DISCORD_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // Webhook author
      username: name,
      avatar_url: avatar_url,

      content: content,
      embeds: embeds,
    }),
  });
}
