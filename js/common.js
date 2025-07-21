document.addEventListener("DOMContentLoaded", function () {
  initRightpannel__inner();
});

function initRightpannel__inner() {
  const foldButton = document.querySelector(".btn__icon.fold");
  const main = document.querySelector(".main");

  // 드로워 토글 기능
  if (foldButton && main) {
    foldButton.addEventListener("click", function (event) {
      event.preventDefault();
      main.classList.toggle("pannel__inner-open");
    });
  }

  // 드로워 섹션 접힘/펼침 기능
  const sectionHeaders = document.querySelectorAll(".collapse__header");
  sectionHeaders.forEach((header) => {
    header.addEventListener("click", function () {
      const section = this.closest(".collapse");
      section.classList.toggle("collapse--expanded");
    });
  });

  // 테이블/컬럼 선택 버튼 클릭 시 드로워 열기
  const tableSelectionBtn = document.querySelector(".btn-table-selection");
  if (tableSelectionBtn && main) {
    tableSelectionBtn.addEventListener("click", function () {
      main.classList.add("pannel__inner-open");
    });
  }

  // SQL 편집 기능
  initSQLEditor();
}

function initSQLEditor() {
  const editBtn = document.querySelector(".sql-btn--edit");
  const sqlDisplay = document.querySelector(".sql-display");
  const sqlEditor = document.querySelector(".sql-editor");

  // 편집 아이콘 SVG
  const editIcon =
    '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12.146 0.146a0.5 0.5 0 0 1 .708 0l3 3a0.5 0.5 0 0 1 0 .708L5.707 14H2v-3.707L12.146 0.146zM13 2.207L13.793 3 3 13.793V15h1.207L15 4.207 13 2.207zM2.5 11.5L4.5 13.5" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>';

  // 완료 아이콘 SVG
  const checkIcon =
    '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13.5 3.5L6 11l-3.5-3.5" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  if (editBtn && sqlDisplay && sqlEditor) {
    editBtn.addEventListener("click", function () {
      if (sqlDisplay.classList.contains("hidden")) {
        // 편집 모드 → 읽기 모드
        sqlDisplay.classList.remove("hidden");
        sqlEditor.classList.add("hidden");

        // textarea의 내용을 pre에 반영
        const sqlCode = sqlDisplay.querySelector("code");
        if (sqlCode) {
          sqlCode.textContent = sqlEditor.value;
        }

        editBtn.innerHTML = editIcon;
        editBtn.title = "편집";
      } else {
        // 읽기 모드 → 편집 모드
        sqlDisplay.classList.add("hidden");
        sqlEditor.classList.remove("hidden");
        sqlEditor.focus();

        editBtn.innerHTML = checkIcon;
        editBtn.title = "완료";
      }
    });
  }
}
