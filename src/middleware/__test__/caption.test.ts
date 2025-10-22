import { validateCaption } from "../caption";

describe("인스타그램 Caption 검증 함수 테스트", () => {
  const validateCaptionText: string = "선린투데이 급식 알림입니다 #밥밥밥";

  it("유효한 캡션일 경우 true를 반환한다.", () => {
    expect(validateCaption(validateCaptionText)).toBe(true);
  });

  it("캡션이 비어있을 경우 에러를 반환한다.", () => {
    expect(() => validateCaption("")).toThrow("캡션이 비어있습니다.");
  });

  it("캡션이 문자열이 아닐 경우 에러를 반환한다.", () => {
    expect(() => validateCaption(1 as any)).toThrow(
      "캡션은 문자열이어야 합니다."
    );
  });

  it("캡션이 너무 길 경우 에러를 반환한다.", () => {
    expect(() => validateCaption("a".repeat(2201))).toThrow(
      "캡션은 2200자를 넘을 수 없습니다."
    );
  });

  it("해시태그가 30개를 넘을 경우 에러를 반환한다.", () => {
    const moreThan30Hashtags = Array(31).fill("#").join("");
    expect(() => validateCaption(moreThan30Hashtags)).toThrow(
      "캡션의 해시태그는 30개를 넘을 수 없습니다."
    );
  });
});
