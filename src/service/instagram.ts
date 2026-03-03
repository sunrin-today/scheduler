import { IgApiClient } from "instagram-private-api";

import { validateCaption } from "../middleware/caption";
import { Logger } from "../utils/logger";

const logger = new Logger();

export class InstagramService {
  private username: string = "";
  private password: string = "";
  private instagramInstance: IgApiClient;

  constructor() {
    this.instagramInstance = new IgApiClient();
  }

  public async login(username: string, password: string): Promise<void> {
    this.username = username;
    this.password = password;

    logger.info(`[Instagram] 로그인 시도 중 (username: ${this.username})`);
    this.instagramInstance.state.generateDevice(this.username);
    logger.info("[Instagram] 기기 정보 생성 완료");

    try {
      logger.info("[Instagram] account.login API 호출 중...");
      await this.instagramInstance.account.login(this.username, this.password);
      logger.info(`[Instagram] 로그인 성공 (username: ${this.username})`);
    } catch (error) {
      const errMsg =
        error instanceof Error ? error.message : String(error);
      const errStack = error instanceof Error ? error.stack : "";
      logger.error(
        `[Instagram] 로그인 실패 (username: ${this.username}) - ${errMsg}`
      );
      logger.error(`[Instagram] 상세 에러: ${errStack}`);
      throw error;
    }
  }

  public async publishPhoto({
    file,
    caption,
    reason,
  }: {
    file: Buffer;
    caption: string;
    reason?: string;
  }): Promise<void> {
    if (!validateCaption(caption)) {
      logger.warn("[Instagram] caption 검증 실패 - 업로드 스킵");
      return;
    }

    try {
      logger.info(
        `[Instagram] 사진 업로드 시작 ${reason ? `(reason: ${reason})` : ""}`
      );
      await this.instagramInstance.publish.photo({
        file,
        caption,
      });
      logger.info(
        `[Instagram] 사진 업로드 성공 (username: ${this.username}) ${
          reason ? `- reason: ${reason}` : ""
        }`
      );
    } catch (error) {
      logger.error(
        `[Instagram] 사진 업로드 실패 (username: ${this.username}) ${
          reason ? `- reason: ${reason}` : ""
        } - ${error}`
      );
      throw error;
    }
  }
}
