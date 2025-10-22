import fs from "fs";
import path from "path";

import { validateImage } from "../image";

describe("validateImage 함수 테스트", () => {
  // 가상 파일 경로 설정
  const validFilePath = path.join(__dirname, "testImage.jpg");
  const invalidSizeFilePath = path.join(__dirname, "largeImage.jpg");
  const invalidExtensionFilePath = path.join(__dirname, "image.gif");
  const nonExistentFilePath = path.join(__dirname, "nonExistent.jpg");

  beforeAll(() => {
    // 테스트에 사용할 파일 생성
    fs.writeFileSync(validFilePath, Buffer.alloc(10 * 1024 * 1024)); // 10MB 파일 생성
    fs.writeFileSync(invalidSizeFilePath, Buffer.alloc(16 * 1024 * 1024)); // 16MB 파일 생성
    fs.writeFileSync(invalidExtensionFilePath, Buffer.alloc(5 * 1024 * 1024)); // 5MB 파일 생성
  });

  afterAll(() => {
    // 테스트 후 파일 삭제
    fs.unlinkSync(validFilePath);
    fs.unlinkSync(invalidSizeFilePath);
    fs.unlinkSync(invalidExtensionFilePath);
  });

  test("올바른 크기와 확장자의 파일은 유효해야 한다", async () => {
    await expect(validateImage(validFilePath)).resolves.toBe(true);
  });

  test("파일 크기가 15MB를 초과하면 오류가 발생해야 한다", async () => {
    await expect(validateImage(invalidSizeFilePath)).rejects.toThrow(
      `이미지의 크기는 15MB를 넘으면 안됩니다: ${invalidSizeFilePath}`
    );
  });

  test("유효하지 않은 확장자의 파일은 오류가 발생해야 한다", async () => {
    await expect(validateImage(invalidExtensionFilePath)).rejects.toThrow(
      `올바르지 않은 이미지의 확장자입니다: ${path.extname(invalidExtensionFilePath).toLowerCase()}`
    );
  });

  test("존재하지 않는 파일은 오류가 발생해야 한다", async () => {
    await expect(validateImage(nonExistentFilePath)).rejects.toThrow(
      `이미지를 가져올 수 없습니다: ${nonExistentFilePath}`
    );
  });
});
