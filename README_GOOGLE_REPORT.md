# KB클린 앱 → Google Slides 보고서 자동 생성 세팅 순서

이 패키지는 **Make 없이 무료에 가깝게** 운영하는 구조입니다.

구조:

```text
직원 앱(Vercel)
→ Vercel API 함수
→ Google Apps Script
→ Google Drive 사진/음성 저장
→ Google Sheet 기록
→ Google Slides 보고서 자동 생성
→ PDF 자동 생성
```

---

## 1단계. Google Apps Script 만들기

1. 브라우저에서 `script.google.com` 접속
2. 새 프로젝트 만들기
3. 기본 `Code.gs` 내용을 전부 삭제
4. 이 폴더의 파일을 열어서 전체 복사

```text
google-apps-script/Code.gs
```

5. Apps Script의 `Code.gs`에 붙여넣기
6. 저장

---

## 2단계. 초기 세팅 실행

Apps Script 상단 함수 선택에서:

```text
initialSetup
```

선택 후 실행 버튼을 누릅니다.

처음에는 권한 승인 화면이 뜹니다.
승인하면 자동으로 아래 파일들이 구글 드라이브에 생성됩니다.

```text
KB클린 현장보고_자동생성_날짜 폴더
KB클린 현장보고_데이터 구글시트
KB클린 현장보고_슬라이드_템플릿
```

---

## 3단계. Apps Script를 웹앱으로 배포

Apps Script 오른쪽 위:

```text
배포 → 새 배포
```

설정:

```text
유형: 웹 앱
실행 사용자: 나
액세스 권한: 모든 사용자
```

배포 후 나오는 URL을 복사합니다.

보통 이렇게 생겼습니다.

```text
https://script.google.com/macros/s/...../exec
```

이 URL이 다음 단계에서 필요합니다.

---

## 4단계. React 앱 파일 적용

기존 GitHub/Vercel 프로젝트에 이 폴더 안의 `react-app` 내용을 올리면 됩니다.

가장 쉬운 방법:

1. `react-app` 폴더 안의 모든 파일을 현재 프로젝트 폴더에 덮어쓰기
2. GitHub Desktop에서 변경사항 확인
3. Summary 입력

```text
connect google report automation
```

4. Commit to main
5. Push origin

---

## 5단계. Vercel 환경변수 넣기

Vercel 프로젝트로 이동:

```text
Settings → Environment Variables
```

아래 이름으로 추가합니다.

```text
GAS_WEBAPP_URL
```

값에는 3단계에서 복사한 Apps Script 웹앱 URL을 넣습니다.

저장 후:

```text
Deployments → 최신 배포 → Redeploy
```

또는 GitHub Desktop에서 다시 Push 하면 자동 배포됩니다.

---

## 6단계. 테스트

앱에서 직원으로 시작:

1. 출근
2. 정기 점검 사진 촬영
3. 필수 증빙 사진 촬영
4. 특이사항 또는 음성 녹음
5. 퇴근하고 보고서 보내기

성공하면 마지막 화면에 아래 버튼이 나옵니다.

```text
생성된 구글 슬라이드 열기
PDF 다운로드/확인
```

동시에 구글 드라이브에 사진, 음성, 슬라이드, PDF가 저장됩니다.

---

## 주의사항

- 사진은 앱에서 자동 압축되어 전송됩니다.
- 그래도 사진을 너무 많이 찍으면 Google Apps Script 용량 제한에 걸릴 수 있습니다.
- 초기 테스트는 현장 1곳, 사진 5~15장 정도로 시작하세요.
- 휴대폰에서 카메라/마이크 권한을 허용해야 합니다.
- Vercel 환경변수 이름은 반드시 `GAS_WEBAPP_URL`이어야 합니다.
