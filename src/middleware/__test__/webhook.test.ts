import { validateDiscordWebhookUrl } from "../webhook";

describe("validateWebhookUrl 함수 테스트", () => {
  it("유효한 Discord Webhook URL은 에러를 발생시키지 않는다", () => {
    const validUrl =
      "https://discord.com/api/webhooks/123456789012345678/abcdefghijklmnopqrstuvwxyz";
    expect(() => validateDiscordWebhookUrl(validUrl)).not.toThrow();
  });

  it('"https://discord.com"으로 시작하지 않는 URL은 에러를 발생시킨다', () => {
    const invalidUrl =
      "https://example.com/api/webhooks/123456789012345678/abcdefghijklmnopqrstuvwxyz";
    expect(() => validateDiscordWebhookUrl(invalidUrl)).toThrow(
      "올바른 Discord Webhook URL이 아닙니다."
    );
  });

  it("ID가 누락된 URL은 에러를 발생시킨다", () => {
    const invalidUrl =
      "https://discord.com/api/webhooks//abcdefghijklmnopqrstuvwxyz";
    expect(() => validateDiscordWebhookUrl(invalidUrl)).toThrow(
      "올바른 Discord Webhook URL이 아닙니다."
    );
  });

  it("토큰이 누락된 URL은 에러를 발생시킨다", () => {
    const invalidUrl = "https://discord.com/api/webhooks/123456789012345678/";
    expect(() => validateDiscordWebhookUrl(invalidUrl)).toThrow(
      "올바른 Discord Webhook URL이 아닙니다."
    );
  });

  it("완전히 잘못된 URL은 에러를 발생시킨다", () => {
    const invalidUrl = "invalid-webhook-url";
    expect(() => validateDiscordWebhookUrl(invalidUrl)).toThrow(
      "올바른 Discord Webhook URL이 아닙니다."
    );
  });
});
