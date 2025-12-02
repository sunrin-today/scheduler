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

// 업로드 스케줄링

async function postManually() {
  logger.info("수동 업로드가 실행됩니다");
  try {
    (await bot).postDaily({ delay: 0 });
    logger.info("수동 업로드가 성공적으로 실행되었습니다");
  } catch {
    logger.error("수동 업로드가  실패했습니다");
  }
}

async function postRestManually() {
  logger.info("휴식 이미지 수동 업로드가 실행됩니다");
  try {
    await (await bot).postRestImage();
    logger.info("휴식 이미지 수동 업로드가 성공적으로 실행되었습니다");
  } catch {
    logger.error("휴식 이미지 수동 업로드가 실패했습니다");
  }
}

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

logger.info("로그인하는 중...");
setTimeout(async () => {
  const mode = process.argv[2];
  if (mode === "rest") {
    await postRestManually();
  } else {
    await postManually();
  }
}, 5000);
