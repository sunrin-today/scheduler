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
      await execPromise(`python3 src/scripts/generate_meal_image.py`);
      console.log("급식 이미지 생성중");
      return await fs.readFileSync(
        path.join(__dirname, "../../build/meal.jpeg")
      );
    } catch (error) {
      logger.error(`급식 이미지 생성 실패`);
      throw error;
    }
  }

  public async generateRestImage(): Promise<ImageServiceResponse> {
    try {
      await execPromise(`python3 src/scripts/generate_rest_image.py`);
      logger.info(`휴식 이미지 생성 성공`);
      return await fs.readFileSync(
        path.join(__dirname, "../../build/rest.jpeg")
      );
    } catch (error) {
      logger.error(`휴식 이미지 생성 실패`);
      throw error;
    }
  }
}
