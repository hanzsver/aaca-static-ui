document.addEventListener("DOMContentLoaded", function () {
  initRightDrawer();
});

function initRightDrawer() {
  const foldButton = document.querySelector(".btn__icon.fold");
  const main = document.querySelector(".main");

  // 드로워 토글 기능
  if (foldButton && main) {
    foldButton.addEventListener("click", function (event) {
      event.preventDefault();
      main.classList.toggle("drawer-open");
    });
  }

  // 드로워 섹션 접힘/펼침 기능
  const sectionHeaders = document.querySelectorAll(".drawer__section-header");
  sectionHeaders.forEach((header) => {
    header.addEventListener("click", function () {
      const section = this.closest(".drawer__section");
      section.classList.toggle("drawer__section--expanded");
    });
  });

  // 테이블/컬럼 선택 버튼 클릭 시 드로워 열기
  const tableSelectionBtn = document.querySelector(".btn-table-selection");
  if (tableSelectionBtn && main) {
    tableSelectionBtn.addEventListener("click", function () {
      main.classList.add("drawer-open");
    });
  }
}
