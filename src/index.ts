import cron from "node-cron";

import { env } from "./constants/env";
import { validateEnv } from "./middleware/env";
import { ImageService } from "./service/image";
import { InstagramService } from "./service/instagram";
import { InstagramBot } from "./service/instagram-bot";
import { Logger } from "./utils/logger";

import "dotenv/config";

// Env가 제대로 설정되어 있는지 확인합니다
validateEnv();

const logger = new Logger();

const initializeBot = async () => {
  const instagramService = new InstagramService();
  const imageService = new ImageService();
  return new InstagramBot(instagramService, imageService);
};

const bot = initializeBot();

const { INSTAGRAM_PASSWORD, ...envForPrint } = env;

console.log("Environments", envForPrint);

cron.schedule(env.INTERVAL, async () => {
  logger.info("일일 업로드 Cron Job이 실행됩니다");
  try {
    const randomDelay = Math.floor(Math.random() * env.RANDOM_DELAY);
    (await bot).postDaily({
      delay: randomDelay,
    });
    logger.info("일일 업로드 Cron Job이 성공적으로 실행되었습니다");
  } catch {
    logger.error("일일 업로드 Cron Job이 실패했습니다");
  }
});

// // 다음날 급식을 Discord Webhook으로 전송하는 스케줄링
// cron.schedule('0 22 * * *', async () => {
//     logger.info('다음날 급식 전송 Cron Job이 실행됩니다');
//     try {
//         // TODO: 급식 정보를 가져와서 Discord Webhook으로 전송하는 로직을 작성합니다
//         logger.info('다음날 급식 전송 Cron Job이 성공적으로 실행되었습니다');
//     } catch {
//         logger.error('다음날 급식 전송 Cron Job이 실패했습니다');
//     }
// });

logger.info("Instagram Bot이 실행되었습니다");
