function createAxRecipeForm() {
  const folder = DriveApp.createFolder('동대문구시설관리공단_AX레시피_교육신청_2026');
  const form = FormApp.create('동대문구시설관리공단 AX 레시피 – 생성형 AI 활용 교육 신청 및 사전 수요조사');
  form.setDescription('2026년 9월 29일(화)~30일(수), 총 8시간으로 운영되는 임직원 대상 생성형 AI 실습 교육 신청 폼입니다.\n\n희망 교육반과 배우고 싶은 AI 도구, 실제 업무 수요를 함께 조사합니다. 응답 내용은 교육 운영과 수업 구성 목적으로만 활용합니다.');
  form.setConfirmationMessage('신청 및 사전 수요조사가 접수되었습니다. 교육반 배정과 준비사항은 별도로 안내드리겠습니다.');
  form.setCollectEmail(false);
  form.setLimitOneResponsePerUser(false);
  form.setAcceptingResponses(true);

  form.addTextItem().setTitle('성명').setRequired(true);
  form.addTextItem().setTitle('소속 부서').setRequired(true);
  form.addTextItem().setTitle('직책·직급').setRequired(true);
  form.addTextItem().setTitle('연락처').setHelpText('교육 운영 안내를 받을 수 있는 번호를 입력해주세요.').setRequired(true);
  const emailValidation = FormApp.createTextValidation().requireTextIsEmail().setHelpText('올바른 이메일 주소를 입력해주세요.').build();
  form.addTextItem().setTitle('이메일').setValidation(emailValidation).setRequired(true);
  form.addMultipleChoiceItem().setTitle('희망 교육반').setChoiceValues(['A반: 9월 29일~30일 09:00~13:00, 총 8시간', 'B반: 9월 29일~30일 14:00~18:00, 총 8시간']).setRequired(true);
  form.addMultipleChoiceItem().setTitle('가장 배우고 싶은 생성형 AI 도구').setChoiceValues(['ChatGPT', 'Claude', 'Gemini', '잘 모르겠다 — 교육 구성에 따라 안내 희망']).setRequired(true);
  form.addMultipleChoiceItem().setTitle('현재 생성형 AI 활용 수준').setChoiceValues(['사용해본 적 없음', '몇 번 사용해봄', '개인적인 용도로 가끔 사용', '업무에서 가끔 사용', '업무에서 자주 사용']).setRequired(true);
  form.addCheckboxItem().setTitle('AI를 활용해보고 싶은 업무').setChoiceValues(['보고서·공문 초안 작성', '회의록·긴 문서 요약', '자료 검색 및 정리', '문서 분류 및 내용 검토', '기획 및 아이디어 도출', '민원·고객 응대 문안 작성', '데이터 분석 및 표 정리', '반복 업무 지원', '기타']).setRequired(true);
  form.addParagraphTextItem().setTitle('교육에서 AI로 해결해보고 싶은 실제 업무').setHelpText('현재 시간이 오래 걸리거나 반복되는 업무를 구체적으로 적어주세요. 개인정보·민감정보는 작성하지 않습니다.').setRequired(true);
  form.addMultipleChoiceItem().setTitle('교육 도구 사용을 위한 개인 계정 준비가 가능한가요?').setChoiceValues(['가능', '안내가 필요함']).setRequired(true);
  form.addCheckboxItem().setTitle('교육 운영을 위한 개인정보 수집·이용에 동의합니다.').setHelpText('수집 항목: 성명, 부서, 직책·직급, 연락처, 이메일 및 사전 수요조사 응답 / 이용 목적: 교육 신청 확인, 반 배정, 교육 운영 및 수업 구성 / 보유 기간: 교육 운영 종료 후 기관 내부 기준에 따라 파기').setChoiceValues(['동의합니다']).setRequired(true);

  const sheet = SpreadsheetApp.create('AX레시피_생성형AI활용_신청자명단_2026');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());
  DriveApp.getFileById(form.getId()).moveTo(folder);
  DriveApp.getFileById(sheet.getId()).moveTo(folder);

  const info = sheet.insertSheet('운영 안내', 0);
  info.getRange('A1:B6').setValues([
    ['항목', '주소'],
    ['Drive 폴더', folder.getUrl()],
    ['Google Form 응답 주소', form.getPublishedUrl()],
    ['Google Form 편집 주소', form.getEditUrl()],
    ['응답 Sheet', sheet.getUrl()],
    ['권한 원칙', 'Form만 응답 가능 · 폴더와 응답 Sheet는 소유자 제한']
  ]);
  info.getRange('A1:B1').setFontWeight('bold').setBackground('#15395b').setFontColor('#ffffff');
  info.setColumnWidth(1, 180);
  info.setColumnWidth(2, 560);
  Logger.log(JSON.stringify({folderUrl: folder.getUrl(), formUrl: form.getPublishedUrl(), formEditUrl: form.getEditUrl(), sheetUrl: sheet.getUrl()}));
}

function getAxRecipeUrls() {
  const folders = DriveApp.getFoldersByName('동대문구시설관리공단_AX레시피_교육신청_2026');
  if (!folders.hasNext()) throw new Error('교육 신청 폴더를 찾을 수 없습니다.');
  const folder = folders.next();
  const files = folder.getFiles();
  let formUrl = '';
  let formEditUrl = '';
  let sheetUrl = '';
  while (files.hasNext()) {
    const file = files.next();
    if (file.getMimeType() === MimeType.GOOGLE_FORMS) {
      const form = FormApp.openById(file.getId());
      formUrl = form.getPublishedUrl();
      formEditUrl = form.getEditUrl();
    }
    if (file.getMimeType() === MimeType.GOOGLE_SHEETS) {
      sheetUrl = SpreadsheetApp.openById(file.getId()).getUrl();
    }
  }
  Logger.log(JSON.stringify({folderUrl: folder.getUrl(), formUrl: formUrl, formEditUrl: formEditUrl, sheetUrl: sheetUrl}));
}

function updatePhoneHelpText() {
  const folders = DriveApp.getFoldersByName('동대문구시설관리공단_AX레시피_교육신청_2026');
  if (!folders.hasNext()) throw new Error('교육 신청 폴더를 찾을 수 없습니다.');
  const files = folders.next().getFilesByType(MimeType.GOOGLE_FORMS);
  if (!files.hasNext()) throw new Error('교육 신청 Form을 찾을 수 없습니다.');
  const form = FormApp.openById(files.next().getId());
  form.getItems(FormApp.ItemType.TEXT).forEach(function(item) {
    const textItem = item.asTextItem();
    if (textItem.getTitle() === '연락처') {
      textItem.setHelpText('예: 010-123-1234 형태로 입력해주세요.');
    }
  });
  Logger.log(form.getPublishedUrl());
}

function inspectResponseRows() {
  const sheet = SpreadsheetApp.openById('18syRXQNCQFj0ItVCXMNryTVBdFIU7-3jjDfzIPr98hg');
  const responseSheet = sheet.getSheetByName('Form Responses 1');
  Logger.log(JSON.stringify({sheetName: responseSheet.getName(), lastRow: responseSheet.getLastRow(), responseCount: Math.max(0, responseSheet.getLastRow() - 1)}));
}

function deleteSingleTestResponse() {
  const sheet = SpreadsheetApp.openById('18syRXQNCQFj0ItVCXMNryTVBdFIU7-3jjDfzIPr98hg');
  const responseSheet = sheet.getSheetByName('Form Responses 1');
  if (responseSheet.getLastRow() !== 2) throw new Error('응답이 정확히 1개인 경우에만 삭제할 수 있습니다.');
  responseSheet.deleteRow(2);
  Logger.log('테스트 응답 1개를 삭제했습니다.');
}
