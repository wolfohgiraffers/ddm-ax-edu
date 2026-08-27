# GitHub Pages 배포 가이드

## 1. GitHub 저장소 만들기

1. GitHub에 로그인합니다.
2. 우측 상단 `+` → `New repository`를 선택합니다.
3. 저장소 이름을 입력합니다. 예: `ax-recipe-2026`
4. 공개 모집 페이지라면 `Public`을 선택하고 저장소를 생성합니다.

## 2. 페이지 파일 올리기

1. 생성한 저장소에서 `Add file` → `Upload files`를 선택합니다.
2. 압축 파일을 먼저 해제합니다.
3. `index.html`, `styles.css`, `script.js`를 포함한 폴더 안의 파일들을 업로드 영역에 끌어놓습니다.
4. 파일이 저장소 최상위에 올라갔는지 확인합니다. `index.html`이 하위 폴더 안에 있으면 안 됩니다.
5. `Commit changes`를 선택합니다.

## 3. GitHub Pages 켜기

1. 저장소 상단 `Settings`를 선택합니다.
2. 왼쪽 메뉴에서 `Pages`를 선택합니다.
3. `Build and deployment`의 Source를 `Deploy from a branch`로 설정합니다.
4. Branch는 `main`, 폴더는 `/ (root)`를 선택하고 `Save`를 누릅니다.
5. 1~3분 후 같은 화면에 공개 주소가 표시됩니다.

공개 주소 예시: `https://사용자명.github.io/ax-recipe-2026/`

## 4. 배포 후 확인

- 첫 화면에 2026년 9월 29일~30일, 총 8시간, A/B반 시간이 보이는지 확인합니다.
- 커리큘럼 5개 항목이 클릭해서 열리고 닫히는지 확인합니다.
- A/B반 카드에 마우스를 올렸을 때 파란 테두리가 표시되는지 확인합니다.
- 모든 신청 버튼이 Google Form으로 이동하는지 확인합니다.
- 휴대전화에서도 제목과 신청 버튼이 잘 보이는지 확인합니다.

## 5. 수정사항 다시 배포하기

1. 저장소에서 `Add file` → `Upload files`를 선택합니다.
2. 수정된 `index.html`, `styles.css`, `script.js`를 다시 업로드합니다.
3. 기존 파일을 덮어쓴 뒤 `Commit changes`를 누릅니다.
4. GitHub Pages가 자동으로 새 버전을 배포합니다. 일반적으로 1~3분 정도 걸립니다.

## 주의

- Google Form 응답 주소는 랜딩페이지에 연결되어 있습니다.
- 신청자 정보가 저장되는 Drive 폴더와 Google Sheets는 공개 권한으로 변경하지 않습니다.
- 내용을 수정한 경우 변경된 파일을 저장소에 다시 업로드하고 기존 파일을 덮어쓰면 자동으로 재배포됩니다.
