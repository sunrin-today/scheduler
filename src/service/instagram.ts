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
    // 클래스 내부에서 사용하는 변수에 계정 정보를 저장합니다.
    this.username = username;
    this.password = password;

    // 로그인을 위한 기기 생성
    this.instagramInstance.state.generateDevice(this.username);
    try {
      await this.instagramInstance.account.login(this.username, this.password);
      logger.info(`인스타그램 로그인 성공 (username: ${this.username})`);
    } catch (error) {
      logger.error(`인스타그램 로그인 실패 (username: ${this.username})`);
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
    if (!validateCaption(caption)) return;

    try {
      await this.instagramInstance.publish.photo({
        file,
        caption,
      });
      logger.info(
        `사진 업로드 성공 (username: ${this.username}) ${
          reason ? `- reason: ${reason}` : ""
        }`
      );
    } catch (error) {
      logger.error(
        `사진 업로드 실패 (username: ${this.username}) ${
          reason ? `- reason: ${reason}` : error
        }`
      );
      throw error;
    }
  }
}
