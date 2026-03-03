import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { promisify } from "util";

import { Logger } from "../utils/logger";

const logger = new Logger();

type ImageServiceResponse = Buffer;

const execPromise = promisify(exec);

export class ImageService {
  public async generateMealImage(): Promise<ImageServiceResponse> {
    try {
      logger.info("[Image] 급식 이미지 생성 시작 (Python 스크립트 실행)");
      await execPromise(`python3 src/scripts/generate_meal_image.py`);
      logger.info("[Image] 급식 이미지 생성 완료");
      return fs.readFileSync(
        path.join(__dirname, "../../build/meal.jpeg")
      );
    } catch (error) {
      logger.error(`[Image] 급식 이미지 생성 실패: ${error}`);
      throw error;
    }
  }

  public async generateRestImage(): Promise<ImageServiceResponse> {
    try {
      logger.info("[Image] 휴식 이미지 생성 시작 (Python 스크립트 실행)");
      await execPromise(`python3 src/scripts/generate_rest_image.py`);
      logger.info("[Image] 휴식 이미지 생성 완료");
      return fs.readFileSync(
        path.join(__dirname, "../../build/rest.jpeg")
      );
    } catch (error) {
      logger.error(`[Image] 휴식 이미지 생성 실패: ${error}`);
      throw error;
    }
  }
}
