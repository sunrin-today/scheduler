import fs from "fs";
import path from "path";

import { IgApiClient } from "instagram-private-api";

import { validateCaption } from "../middleware/caption";
import { Logger } from "../utils/logger";

const logger = new Logger();
const STATE_DIR = path.join(process.cwd(), "data");
const STATE_FILE = path.join(STATE_DIR, "instagram_state.json");

export class InstagramService {
  private username: string = "";
  private password: string = "";
  private instagramInstance: IgApiClient;

  constructor() {
    this.instagramInstance = new IgApiClient();
  }

  private async saveState(): Promise<void> {
    try {
      if (!fs.existsSync(STATE_DIR)) {
        fs.mkdirSync(STATE_DIR, { recursive: true });
      }
      const serialized = await this.instagramInstance.state.serialize();
      delete serialized.constants;
      fs.writeFileSync(STATE_FILE, JSON.stringify(serialized));
      logger.info("[Instagram] 세션 상태 저장 완료");
    } catch (error) {
      logger.warn(`[Instagram] 세션 상태 저장 실패 (무시): ${error}`);
    }
  }

  private async loadState(): Promise<boolean> {
    try {
      if (!fs.existsSync(STATE_FILE)) return false;
      const raw = fs.readFileSync(STATE_FILE, "utf-8");
      await this.instagramInstance.state.deserialize(raw);
      logger.info("[Instagram] 저장된 세션 상태 복원 완료");
      return true;
    } catch (error) {
      logger.warn(`[Instagram] 세션 상태 복원 실패, 재로그인 진행: ${error}`);
      try {
        fs.unlinkSync(STATE_FILE);
      } catch {}
      return false;
    }
  }

  public async login(username: string, password: string): Promise<void> {
    this.username = username;
    this.password = password;

    logger.info(`[Instagram] 로그인 시도 중 (username: ${this.username})`);
    this.instagramInstance.state.generateDevice(this.username);
    logger.info("[Instagram] 기기 정보 생성 완료");

    const stateLoaded = await this.loadState();

    if (stateLoaded) {
      logger.info(`[Instagram] 세션 재사용 (username: ${this.username})`);
      return;
    }

    try {
      logger.info("[Instagram] account.login API 호출 중...");
      await this.instagramInstance.account.login(this.username, this.password);
      logger.info(`[Instagram] 로그인 성공 (username: ${this.username})`);
      await this.saveState();
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
