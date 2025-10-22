import fs from "fs";
import path from "path";

export const validateImage = async (filePath: string) => {
  try {
    const stats = await fs.promises.stat(filePath);

    // 파일 크기 검사 (15MB 제한)
    const maxSize = 15 * 1024 * 1024; // 15MB in bytes
    if (stats.size > maxSize) {
      throw new Error(`이미지의 크기는 15MB를 넘으면 안됩니다: ${filePath}`);
    }

    // 파일 확장자 검사
    const validExtensions = [".jpg", ".jpeg", ".png"];
    const extension = path.extname(filePath).toLowerCase();
    if (!validExtensions.includes(extension)) {
      throw new Error(`올바르지 않은 이미지의 확장자입니다: ${extension}`);
    }

    return true;
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      throw new Error(`이미지를 가져올 수 없습니다: ${filePath}`);
    }
    throw error;
  }
};
