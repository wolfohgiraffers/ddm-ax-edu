document.querySelectorAll('.js-form-link').forEach((link) => {
  link.addEventListener('click', (event) => {
    if (link.getAttribute('href') === '#google-form-placeholder') {
      event.preventDefault();
      window.alert('Google Form 주소를 연결하면 신청 페이지로 이동합니다.\nscript 수정 없이 index.html의 #google-form-placeholder를 실제 주소로 바꿔주세요.');
    }
  });
});

document.querySelectorAll('details').forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    const group = item.closest('.timeline, .accordion');
    if (!group) return;
    group.querySelectorAll('details[open]').forEach((other) => {
      if (other !== item) other.open = false;
    });
  });
});
