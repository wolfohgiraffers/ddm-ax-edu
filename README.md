# AX 레시피 - 생성형 AI 활용 교육 랜딩페이지

동대문구시설관리공단 임직원 대상 8시간 교육 모집을 위한 GitHub Pages용 정적 사이트입니다.

## Google Form 연결

모든 신청 버튼은 생성된 AX 레시피 교육 신청 Google Form으로 연결되어 있습니다.

## 로컬 확인

`index.html`을 브라우저에서 열면 바로 확인할 수 있습니다. 웹 서버를 사용할 경우 이 폴더를 문서 루트로 지정합니다.

## GitHub Pages 배포

1. 새 GitHub 저장소를 만들고 `index.html`, `styles.css`, `script.js`를 저장소 최상위에 올립니다.
2. 저장소의 **Settings → Pages**로 이동합니다.
3. **Build and deployment**에서 **Deploy from a branch**를 선택합니다.
4. 배포 브랜치를 `main`, 폴더를 `/ (root)`로 지정하고 저장합니다.
5. 잠시 후 표시되는 `https://사용자명.github.io/저장소명/` 주소로 접속합니다.

별도 빌드 과정이나 서버는 필요하지 않습니다.

Google Form 문항과 권장 설정은 `GOOGLE_FORM_SETUP.md`에 정리되어 있습니다.
