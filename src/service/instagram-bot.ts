import { env } from '../constants/env';
import { DelayOptions } from '../types';
import { getDayName, isFirstWeekdayOfMonth } from '../utils/date';
import { Logger } from '../utils/logger';
import { ImageService } from './image';
import { InstagramService } from './instagram';
import { WebhookPostNotification } from './webhook/notification';

const logger = new Logger();

export class InstagramBot {
  private instagramService: InstagramService;
  private imageService: ImageService;

  constructor(instagramService: InstagramService, imageService: ImageService) {
    this.instagramService = instagramService;
    this.imageService = imageService;

    this.instagramService.login(
      process.env.INSTAGRAM_USERNAME,
      process.env.INSTAGRAM_PASSWORD,
    );
  }

  async postDaily({ delay = 0 }: DelayOptions) {
    try {
      const date = new Date();

      setTimeout(async () => {
        if (isFirstWeekdayOfMonth(date)) {
          await this.postMonthlyRestImage(date);
        }

        // 매일 트리거 되는 급식 이미지 업로드
        await this.postMealImage(date);

        WebhookPostNotification();
      }, delay * 60 * 1000);
    } catch (error) {
      console.error(`일일 업로드 실패: ${error}`);
    }
  }

  private async postMonthlyRestImage(date: Date) {
    try {
      const restImage = await this.imageService.generateRestImage();

      const monthDate = `${date.getFullYear()}년 ${String(
        date.getMonth() + 1,
      ).padStart(2, '0')}월`;

      await this.instagramService.publishPhoto({
        file: restImage,
        caption: `이 달의 휴식 - ${monthDate}`,
        reason: 'monthly',
      });
      logger.info(`이 달의 휴식 이미지 업로드 성공`);
    } catch (error) {
      logger.error(`이 달의 휴식 이미지 업로드 실패: ${error}`);
      throw error;
    }
  }

  private async postMealImage(date: Date) {
    try {
      const isExist = await fetch('https://api.sunrin.kr/meal/today')
        .then((res) => {
          return res.status === 200; // 404면 true, 아니면 false 반환
        })
        .catch((error) => {
          console.error('Error:', error);
          return false;
        });

      if (!isExist) return;

      const mealImage = await this.imageService.generateMealImage();
      const formattedDate = `${date.getFullYear()}년 ${String(
        date.getMonth() + 1,
      ).padStart(2, '0')}월 ${String(date.getDate()).padStart(
        2,
        '0',
      )}일 ${getDayName(date, 'ko')}요일`;

      await this.instagramService.publishPhoto({
        file: mealImage,
        caption: `${env.SCHOOL_NAME} 오늘의 정보\n\n${formattedDate}\n\n#급식표 #밥밥밥`,
      });

      logger.info(`급식 이미지 업로드 성공`);
    } catch (error) {
      logger.error(`급식 이미지 업로드 실패: ${error}`);
      throw error;
    }
  }
}
