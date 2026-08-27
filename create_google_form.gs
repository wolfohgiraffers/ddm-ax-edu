const AX_FOLDER_NAME = '동대문구시설관리공단_AX레시피_교육신청_2026';
const AX_FORM_TITLE = '동대문구시설관리공단 AX 레시피 – 생성형 AI 활용 교육 신청 및 사전 수요조사';
const AX_SHEET_TITLE = 'AX레시피_생성형AI활용_신청자명단_2026';

function createAxRecipeForm() {
  const folder = DriveApp.createFolder(AX_FOLDER_NAME);
  const form = FormApp.create(AX_FORM_TITLE);
  configureForm_(form);
  addAxRecipeQuestions_(form);

  const sheet = SpreadsheetApp.create(AX_SHEET_TITLE);
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());
  DriveApp.getFileById(form.getId()).moveTo(folder);
  DriveApp.getFileById(sheet.getId()).moveTo(folder);
  addOperationInfo_(sheet, folder.getUrl(), form);

  Logger.log(JSON.stringify({
    folderUrl: folder.getUrl(),
    formUrl: form.getPublishedUrl(),
    formEditUrl: form.getEditUrl(),
    sheetUrl: sheet.getUrl()
  }));
}

/**
 * 이미 만든 Google Form과 응답 Sheet를 새 사전설문 문항으로 교체합니다.
 * 응답 시트에 실제 응답이 있으면 중단하여 기존 신청자를 보호합니다.
 */
function updateAxRecipeFormFromSurvey() {
  const resources = getAxResources_();
  const form = resources.form;
  const sheet = resources.sheet;
  const oldResponseSheets = getResponseSheets_(sheet);

  oldResponseSheets.forEach(function(responseSheet) {
    if (responseSheet.getLastRow() > 1) {
      throw new Error('기존 응답이 있어 자동 변경을 중단했습니다. 응답을 별도 보관한 뒤 다시 실행해주세요.');
    }
  });

  form.setAcceptingResponses(false);
  form.deleteAllResponses();
  form.getItems().slice().reverse().forEach(function(item) {
    form.deleteItem(item);
  });

  configureForm_(form);
  addAxRecipeQuestions_(form);

  form.removeDestination();
  oldResponseSheets.forEach(function(responseSheet) {
    sheet.deleteSheet(responseSheet);
  });

  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());
  SpreadsheetApp.flush();
  Utilities.sleep(1000);

  const newResponseSheets = getResponseSheets_(sheet);
  if (!newResponseSheets.length) {
    throw new Error('새 응답 시트를 확인하지 못했습니다. 잠시 후 응답 Sheet를 확인해주세요.');
  }

  const responseSheet = newResponseSheets[newResponseSheets.length - 1];
  responseSheet.setName('AX레시피_신청응답_2026');
  responseSheet.setFrozenRows(1);
  if (responseSheet.getLastColumn() > 0) {
    responseSheet.getRange(1, 1, 1, responseSheet.getLastColumn())
      .setBackground('#173a5e')
      .setFontColor('#ffffff')
      .setFontWeight('bold')
      .setWrap(true);
    responseSheet.setColumnWidth(1, 150);
    responseSheet.setColumnWidths(2, 4, 140);
    responseSheet.setColumnWidths(6, 2, 220);
    if (responseSheet.getLastColumn() >= 8) {
      responseSheet.setColumnWidths(8, responseSheet.getLastColumn() - 7, 260);
    }
  }

  form.setAcceptingResponses(true);
  Logger.log(JSON.stringify({
    formUrl: form.getPublishedUrl(),
    formEditUrl: form.getEditUrl(),
    sheetUrl: sheet.getUrl(),
    responseSheet: responseSheet.getName(),
    questionCount: form.getItems().length
  }));
}

function configureForm_(form) {
  form.setTitle(AX_FORM_TITLE);
  form.setDescription(
    '2026년 9월 29일(화)~30일(수), 총 8시간으로 운영되는 임직원 대상 생성형 AI 실습 교육 신청 및 사전설문입니다.\n\n' +
    'AI 사용 능력을 평가하는 설문이 아니라 수업 속도와 실습 예시를 준비하기 위한 조사입니다. 현재 AI를 사용하지 않거나 사용을 중단한 상태여도 괜찮습니다.\n\n' +
    '예상 시간: 약 5분\n' +
    '※ 정답이나 모범 응답은 없습니다.\n' +
    '※ 개인정보·고객정보·계정정보·내부 기밀은 입력하지 마세요.\n' +
    '※ 실제 업무 자료를 제출할 필요는 없습니다.'
  );
  form.setConfirmationMessage(
    '응답해 주셔서 감사합니다. 현재 AI를 얼마나 사용하는지보다, 업무에서 어떤 도움이 필요한지를 확인하는 것이 이번 설문의 목적입니다. 응답 내용을 바탕으로 처음 사용하는 분과 다시 시도하는 분도 부담 없이 참여할 수 있도록 수업 속도와 예시를 준비하겠습니다. 교육 당일에는 개인정보와 내부 기밀이 없는 공통 예시로 먼저 연습합니다.'
  );
  form.setCollectEmail(false);
  form.setLimitOneResponsePerUser(false);
  form.setProgressBar(true);
  form.setShuffleQuestions(false);
}

function addAxRecipeQuestions_(form) {
  form.addSectionHeaderItem()
    .setTitle('1. 신청자 정보')
    .setHelpText('교육 운영과 안내에 필요한 최소 정보만 입력해주세요.');
  form.addTextItem().setTitle('성명').setRequired(true);
  form.addTextItem().setTitle('소속 부서').setRequired(true);
  form.addTextItem().setTitle('직책·직급').setRequired(true);
  form.addTextItem()
    .setTitle('연락처')
    .setHelpText('예: 010-123-1234 형태로 입력해주세요.')
    .setRequired(true);

  form.addSectionHeaderItem()
    .setTitle('2. 교육 참여 선택')
    .setHelpText('희망 분반과 가장 배우고 싶은 AI 도구를 선택해주세요.');
  form.addMultipleChoiceItem()
    .setTitle('희망 교육반')
    .setChoiceValues([
      'A반: 9월 29일~30일 09:00~13:00, 총 8시간',
      'B반: 9월 29일~30일 14:00~18:00, 총 8시간'
    ])
    .setRequired(true);
  form.addMultipleChoiceItem()
    .setTitle('가장 배우고 싶은 생성형 AI 도구')
    .setChoiceValues([
      'ChatGPT',
      'Claude',
      'Gemini',
      '잘 모르겠다 — 교육 구성에 따라 안내 희망'
    ])
    .showOtherOption(true)
    .setRequired(true);

  form.addSectionHeaderItem()
    .setTitle('3. 업무 및 AI 활용 사전설문')
    .setHelpText('응답은 교육 난이도와 실습 예시를 준비하는 데만 활용합니다.');

  form.addTextItem()
    .setTitle('Q1. 현재 주로 담당하는 업무를 간단히 적어주세요.')
    .setHelpText('예: 월간 점검 결과 취합 및 보고서 작성')
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Q2. 현재 생성형 AI 활용 경험과 가장 가까운 것을 선택해 주세요.')
    .setChoiceValues([
      '사용해 본 적이 없다',
      '한두 번 체험했지만 업무에는 사용하지 않았다',
      '업무에 사용해 봤지만 원하는 결과를 얻기 어려워 지금은 거의 사용하지 않는다',
      '개인적으로는 사용하지만 업무에 적용하기 어렵다',
      '일부 업무에 월 1~2회 정도 사용한다',
      '일부 업무에 주 2~3회 이상 사용한다',
      '여러 업무에 거의 매일 사용한다'
    ])
    .setRequired(true);

  const maxTwo = FormApp.createCheckboxValidation()
    .requireSelectAtMost(2)
    .setHelpText('최대 2개까지 선택할 수 있습니다.')
    .build();
  form.addCheckboxItem()
    .setTitle('Q3. AI를 업무에 활용하면서 어렵거나 부담스러웠던 점을 최대 2개 선택해 주세요.')
    .setChoiceValues([
      '무엇을 어떻게 요청해야 할지 몰랐다',
      '결과가 너무 일반적이거나 원하는 내용과 달랐다',
      '결과가 정확한지 판단하기 어려웠다',
      '결과를 다시 고치느라 시간이 더 걸렸다',
      '업무 자료를 입력해도 되는지 걱정됐다',
      '로그인·화면 조작·파일 첨부가 어려웠다',
      '내 업무의 어디에 활용해야 할지 모르겠다',
      '충분히 사용해 보지 않아 아직 판단하기 어렵다',
      '특별히 어려운 점은 없었다'
    ])
    .showOtherOption(true)
    .setValidation(maxTwo)
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('Q4. 사용해 본 생성형 AI 도구를 모두 선택해 주세요.')
    .setHelpText('무료·유료 여부와 관계없이 선택해 주세요.')
    .setChoiceValues([
      'ChatGPT',
      'Claude',
      'Gemini',
      'Microsoft Copilot',
      'NotebookLM',
      '회사에서 제공하는 AI 도구',
      '이름은 잘 모르지만 사용해 본 도구가 있다',
      '사용 경험 없음'
    ])
    .showOtherOption(true)
    .setRequired(true);

  const maxThree = FormApp.createCheckboxValidation()
    .requireSelectAtMost(3)
    .setHelpText('최대 3개까지 선택할 수 있습니다.')
    .build();
  form.addCheckboxItem()
    .setTitle('Q5. 평소 자주 수행하는 업무를 최대 3개 선택해 주세요.')
    .setChoiceValues([
      '민원·문의 확인 및 답변',
      '보고서·기안문 작성',
      '공문·안내문 작성',
      '자료 조사 및 요약',
      '회의 준비 및 회의록 정리',
      '엑셀 자료 정리·취합·집계',
      '시설 점검·운영 현황 관리',
      '일정·업무 진행 상황 관리',
      '기존 문서 반복 수정·재작성'
    ])
    .showOtherOption(true)
    .setValidation(maxThree)
    .setRequired(true);

  form.addTextItem()
    .setTitle('Q6. 위 업무 중 “조금이라도 덜 힘들어졌으면 좋겠다”고 생각하는 업무 한 가지를 적어주세요.')
    .setHelpText('예: 여러 부서에서 받은 엑셀 자료를 모아 월간 보고서를 만드는 업무\nAI로 해결할 수 있는지는 미리 판단하지 않아도 됩니다.')
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('Q7. 자주 사용하는 파일 형식을 모두 선택해 주세요.')
    .setChoiceValues([
      '한글(HWP)',
      'Word',
      'Excel·CSV',
      'PDF',
      'PowerPoint',
      '이미지 파일',
      '잘 모르겠다'
    ])
    .showOtherOption(true)
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('Q8. 업무 자료는 주로 어디에 보관하거나 관리하나요?')
    .setHelpText('시스템 이름이나 계정정보는 적지 않아도 됩니다.')
    .setChoiceValues([
      '개인 업무용 PC',
      '사내 공유폴더',
      '클라우드 드라이브',
      '그룹웨어·전자결재',
      '별도 업무시스템',
      '이메일·메신저',
      '잘 모르겠다'
    ])
    .showOtherOption(true)
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Q9. 교육 실습에서 업무 사례를 다룬다면 어떤 방식이 가장 편한가요?')
    .setHelpText('실제 업무 자료 제출은 필수가 아닙니다. 필요한 경우 개인정보·기밀정보를 제거한 자료만 사용합니다.')
    .setChoiceValues([
      '교육에서 제공하는 공통 예시로 먼저 따라 해보고 싶다',
      '공통 예시로 연습한 후 내 업무와 비슷한 사례로 바꿔보고 싶다',
      '개인정보·기밀정보를 제거한 내 업무 예시를 활용해 보고 싶다',
      '아직 어떤 방식이 편한지 잘 모르겠다'
    ])
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('Q10. 이번 교육에서 가장 도움받고 싶은 내용을 최대 2개 선택해 주세요.')
    .setChoiceValues([
      'AI 기본 사용법을 천천히 익히고 싶다',
      'AI에게 무엇을 어떻게 요청하는지 익히고 싶다',
      '원하는 결과가 나오지 않을 때 수정하는 방법을 알고 싶다',
      'AI 결과의 오류나 누락을 확인하는 방법을 알고 싶다',
      '업무 자료를 안전하게 다루는 기준을 알고 싶다',
      '문서 작성·요약 업무를 직접 완성해 보고 싶다',
      '엑셀 자료 정리·분석 업무를 직접 완성해 보고 싶다',
      '내 업무에서 AI가 도울 수 있는 부분을 찾고 싶다',
      '부담 없이 사용해 보며 내 업무에 맞는지 판단하고 싶다',
      '아직 잘 모르겠다'
    ])
    .showOtherOption(true)
    .setValidation(maxTwo)
    .setRequired(true);

  form.addSectionHeaderItem()
    .setTitle('4. 교육 당일 실습 환경')
    .setHelpText('실습 준비를 확인하기 위한 문항이며 AI 활용 능력을 평가하지 않습니다.');
  form.addMultipleChoiceItem()
    .setTitle('Q11. 교육 당일 실습 환경과 가장 가까운 것을 선택해 주세요.')
    .setChoiceValues([
      '노트북과 사용 가능한 AI 계정이 모두 있다',
      '노트북은 있지만 AI 계정 준비가 필요하다',
      'AI 계정은 있지만 노트북 준비가 필요하다',
      '노트북과 계정 모두 준비가 필요하다',
      '사내 보안·네트워크 제한 여부를 확인해야 한다',
      '잘 모르겠다'
    ])
    .setRequired(false);

  form.addCheckboxItem()
    .setTitle('교육 운영을 위한 개인정보 수집·이용에 동의합니다.')
    .setHelpText('수집 항목: 성명, 부서, 직책·직급, 연락처 및 사전설문 응답 / 이용 목적: 신청 확인, 반 배정, 교육 운영 및 수업 구성 / 보유 기간: 교육 운영 종료 후 기관 내부 기준에 따라 파기')
    .setChoiceValues(['동의합니다'])
    .setRequired(true);
}

function getResponseSheets_(spreadsheet) {
  return spreadsheet.getSheets().filter(function(sheet) {
    return /^(Form Responses|설문지 응답|AX레시피_신청응답_2026)/.test(sheet.getName());
  });
}

function getAxResources_() {
  const folders = DriveApp.getFoldersByName(AX_FOLDER_NAME);
  if (!folders.hasNext()) throw new Error('교육 신청 폴더를 찾을 수 없습니다.');
  const folder = folders.next();
  const files = folder.getFiles();
  let form = null;
  let sheet = null;

  while (files.hasNext()) {
    const file = files.next();
    if (file.getMimeType() === MimeType.GOOGLE_FORMS && file.getName() === AX_FORM_TITLE) {
      form = FormApp.openById(file.getId());
    }
    if (file.getMimeType() === MimeType.GOOGLE_SHEETS && file.getName() === AX_SHEET_TITLE) {
      sheet = SpreadsheetApp.openById(file.getId());
    }
  }

  if (!form) throw new Error('교육 신청 Form을 찾을 수 없습니다.');
  if (!sheet) throw new Error('교육 신청 응답 Sheet를 찾을 수 없습니다.');
  return {folder: folder, form: form, sheet: sheet};
}

function addOperationInfo_(sheet, folderUrl, form) {
  const info = sheet.insertSheet('운영 안내', 0);
  info.getRange('A1:B6').setValues([
    ['항목', '주소'],
    ['Drive 폴더', folderUrl],
    ['Google Form 응답 주소', form.getPublishedUrl()],
    ['Google Form 편집 주소', form.getEditUrl()],
    ['응답 Sheet', sheet.getUrl()],
    ['권한 원칙', 'Form만 응답 가능 · 폴더와 응답 Sheet는 소유자 제한']
  ]);
  info.getRange('A1:B1').setFontWeight('bold').setBackground('#173a5e').setFontColor('#ffffff');
  info.setColumnWidth(1, 180);
  info.setColumnWidth(2, 560);
}

function getAxRecipeUrls() {
  const resources = getAxResources_();
  Logger.log(JSON.stringify({
    folderUrl: resources.folder.getUrl(),
    formUrl: resources.form.getPublishedUrl(),
    formEditUrl: resources.form.getEditUrl(),
    sheetUrl: resources.sheet.getUrl()
  }));
}

function inspectResponseRows() {
  const resources = getAxResources_();
  const responseSheets = getResponseSheets_(resources.sheet);
  Logger.log(JSON.stringify(responseSheets.map(function(responseSheet) {
    return {
      sheetName: responseSheet.getName(),
      lastRow: responseSheet.getLastRow(),
      responseCount: Math.max(0, responseSheet.getLastRow() - 1)
    };
  })));
}
