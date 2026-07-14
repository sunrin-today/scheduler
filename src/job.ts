import { env } from "./constants/env";
import { validateJobEnv } from "./middleware/env";
import { ImageService } from "./service/image";
import { InstagramService } from "./service/instagram";
import { InstagramBot } from "./service/instagram-bot";
import { Logger } from "./utils/logger";

import "dotenv/config";

validateJobEnv();

const logger = new Logger();

const initializeBot = async () => {
  logger.info("[초기화] 봇 초기화 시작...");
  const instagramService = new InstagramService();
  const imageService = new ImageService();
  const bot = new InstagramBot(instagramService, imageService);
  await bot.init();
  logger.info("[초기화] 봇 초기화 완료");
  return bot;
};

(async () => {
  try {
    const bot = await initializeBot();
    const randomDelay = Math.floor(Math.random() * env.RANDOM_DELAY);

    logger.info(`[Job] 일일 업로드 시작 (랜덤 지연: ${randomDelay}분)`);
    await bot.postDaily({ delay: randomDelay });
    logger.info("[Job] 일일 업로드 완료");
    process.exit(0);
  } catch (error) {
    logger.error(`[Job] 실행 실패: ${error}`);
    process.exit(1);
  }
})();
