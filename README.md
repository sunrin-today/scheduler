![Cover Image](/assets/banner_rounded.png)

# 선린투데이

선린인터넷고등학교 급식 정보를 인스타그램에 자동으로 게시하는 프로젝트 입니다.

인스타그램 [@sunrin_today](https://instagram.com/sunrin_today)에서 게시물을 확인하실 수 있습니다.

## 기능

- 매일 아침 7시 급식 정보 게시
- 매월 1일에 해당 월의 휴일 정보를 게시

## 개발자
- [Sungju Cho](https://github.com/) - Node.js 스케줄링 시스템 구현
- [Jeewon Kwon](https://github.com/jwkwon0817) - 파이썬 PIL 기반 동적 이미지 생성 구현

## 설치 및 실행

### 개발 환경

```bash
# 의존성 설치
pnpm install

# 개발 모드 실행
pnpm run dev

# 빌드
pnpm run build

# 프로덕션 실행
pnpm start
```

### Docker

```bash
# 이미지 빌드
docker build . -t sunrin-today

# 컨테이너 실행
docker run sunrin-today
```

## 환경 설정

자세한 내용은 `.env.sample` 파일을 확인 해주세요.

## 라이선스

선린투데이 프로젝트는 [BSD-2-Clause](LICENSE) 라이센스를 채택하고 있습니다.

자세한 내용은 [LICENSE](LICENSE) 파일을 확인 해주세요.