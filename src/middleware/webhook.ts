export function validateDiscordWebhookUrl(webhookUrl: string) {
  const discordWebhookUrlRegex =
    /https:\/\/discord.com\/api\/webhooks\/\d+\/[\w-]+/;

  if (!discordWebhookUrlRegex.test(webhookUrl)) {
    throw new Error("올바른 Discord Webhook URL이 아닙니다.");
  }
}
