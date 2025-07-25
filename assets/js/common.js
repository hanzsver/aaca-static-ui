document.addEventListener("DOMContentLoaded", function () {
  initRightpannel__inner();
  initAutoResizeTextarea();
  initCurrentQuerySettings();
  initQueryHistory();
  initChatInput();
});

// 전역 변수로 쿼리 히스토리 관리
let queryHistory = [];
let queryIdCounter = 1;
let currentUserQuery = "";

function initRightpannel__inner() {
  const foldButton = document.querySelector(".btn__icon.fold");
  const main = document.querySelector(".main");

  // 드로워 토글 기능
  if (foldButton && main) {
    foldButton.addEventListener("click", function (event) {
      event.preventDefault();
      main.classList.toggle("pannel-open");
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
      main.classList.add("pannel-open");
    });
  }

  // 탭 전환 기능
  initTabSwitching();

  // SQL 편집 기능
  initSQLEditor();
}

function initChatInput() {
  const chatInput = document.querySelector(".chat-input__input textarea");
  const sendButton = document.querySelector(".chat-input__send-btn");
  let isSending = false; // 전송 중복 방지 플래그

  if (chatInput && sendButton) {
    // 엔터키로 전송
    chatInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    // 전송 버튼 클릭
    sendButton.addEventListener("click", function () {
      sendMessage();
    });
  }

  function sendMessage() {
    // 이미 전송 중이면 중단
    if (isSending) return;

    const message = chatInput.value.trim();
    if (!message) return;

    // 전송 시작
    isSending = true;

    // 사용자 메시지 추가
    currentUserQuery = message;
    addUserMessage(message);

    // 입력창 즉시 초기화
    chatInput.value = "";

    // AI 응답 (테이블/컬럼 선택 안내)
    setTimeout(() => {
      addAITableRecommendation(message);
      // 전송 완료
      isSending = false;
    }, 500);
  }
}

function addUserMessage(message) {
  const content = `
    <div class="chat-container__bubble-header">
      <span>You</span>
    </div>
    <div class="chat-container__bubble-content">
      <p>${message}</p>
      <div class="message-actions">
        <button class="action-btn copy-btn" title="복사">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M13.5 2.5H6.5C5.94772 2.5 5.5 2.94772 5.5 3.5V4.5H4.5C3.94772 4.5 3.5 4.94772 3.5 5.5V12.5C3.5 13.0523 3.94772 13.5 4.5 13.5H11.5C12.0523 13.5 12.5 13.0523 12.5 12.5V11.5H13.5C14.0523 11.5 14.5 11.0523 14.5 10.5V3.5C14.5 2.94772 14.0523 2.5 13.5 2.5Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
          </svg>
        </button>
      </div>
    </div>
  `;

  addChatBubble("user", content);
}

function addAITableRecommendation(userQuery) {
  const content = `
    <div class="chat-container__bubble-header">
      <span>Claude Sonnet 4</span>
    </div>
    <div class="chat-container__bubble-content">
      <p>요청하신 내용을 분석하여 관련 테이블과 컬럼을 추천해드립니다.</p>
      <p>우측 패널의 "<strong>Builder</strong>" 탭에서 테이블과 컬럼을 선택한 후 "Generate Query" 버튼을 클릭해주세요.</p>

      <div class="ai-recommendation">
        <div class="recommendation-card">
          <h4>🎯 추천 테이블</h4>
          <p>질의 내용에 따라 적합한 테이블을 선택하세요:</p>
          <ul>
            <li><strong>emails</strong> - 이메일 관련 데이터</li>
            <li><strong>users</strong> - 사용자 정보</li>
            <li><strong>departments</strong> - 부서 정보</li>
          </ul>
        </div>
      </div>

      <div class="action-prompt">
        <button type="button" class="btn btn--primary btn--md open-settings-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="18" viewBox="0 0 17 18" fill="none">
              <path d="M2.87806 14.4634C2.50245 14.4634 2.18091 14.3297 1.91343 14.0622C1.64595 13.7948 1.51221 13.4732 1.51221 13.0976V4.90247C1.51221 4.52686 1.64595 4.20532 1.91343 3.93784C2.18091 3.67036 2.50245 3.53662 2.87806 3.53662H13.8049C14.1805 3.53662 14.502 3.67036 14.7695 3.93784C15.037 4.20532 15.1707 4.52686 15.1707 4.90247V13.0976C15.1707 13.4732 15.037 13.7948 14.7695 14.0622C14.502 14.3297 14.1805 14.4634 13.8049 14.4634H2.87806ZM2.87806 13.0976H7.65855V4.90247H2.87806V13.0976ZM9.0244 13.0976H13.8049V4.90247H9.0244V13.0976ZM9.70733 11.0488H13.122V10.0244H9.70733V11.0488ZM9.70733 9.3415H13.122V8.31711H9.70733V9.3415ZM9.70733 7.63418H13.122V6.60979H9.70733V7.63418Z" fill="#ffffff"></path>
            </svg>
            <span>Open Builder</span>
        </button>
      </div>

      <div class="message-actions">
        <button class="action-btn copy-btn" title="복사">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M13.5 2.5H6.5C5.94772 2.5 5.5 2.94772 5.5 3.5V4.5H4.5C3.94772 4.5 3.5 4.94772 3.5 5.5V12.5C3.5 13.0523 3.94772 13.5 4.5 13.5H11.5C12.0523 13.5 12.5 13.0523 12.5 12.5V11.5H13.5C14.0523 11.5 14.5 11.0523 14.5 10.5V3.5C14.5 2.94772 14.0523 2.5 13.5 2.5Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
          </svg>
        </button>
        <button class="action-btn thumbs-up-btn" title="좋아요">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8.5 2.5C8.5 2.5 10 1 12 3.5C12 3.5 13.5 5 13.5 7.5C13.5 10 12 11.5 8.5 11.5H5.5C4.94772 11.5 4.5 11.0523 4.5 10.5V6.5C4.5 5.94772 4.94772 5.5 5.5 5.5H8.5V2.5Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
          </svg>
        </button>
        <button class="action-btn thumbs-down-btn" title="싫어요">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M7.5 13.5C7.5 13.5 6 15 4 12.5C4 12.5 2.5 11 2.5 8.5C2.5 6 4 4.5 7.5 4.5H10.5C11.0523 4.5 11.5 4.94772 11.5 5.5V9.5C11.5 10.0523 11.0523 10.5 10.5 10.5H7.5V13.5Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
          </svg>
        </button>
        <button class="action-btn refresh-btn" title="새로고침">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M13.5 8C13.5 11.0376 11.0376 13.5 8 13.5C4.96243 13.5 2.5 11.0376 2.5 8C2.5 4.96243 4.96243 2.5 8 2.5C9.5 2.5 10.8 3.2 11.7 4.3M11.5 2.5V4.5H9.5" stroke="currentColor" stroke-width="1.5" fill="none"/>
          </svg>
        </button>
      </div>
    </div>
  `;

  addChatBubble("asst", content);

  // 현재 질의 설정 열기 버튼 이벤트
  setTimeout(() => {
    const openSettingsBtn = document.querySelector(".open-settings-btn");
    if (openSettingsBtn) {
      openSettingsBtn.addEventListener("click", function () {
        // 패널 열기
        const main = document.querySelector(".main");
        main.classList.add("pannel-open");

        // 현재 질의 설정 탭으로 전환
        const currentQueryTab = document.querySelector(
          '[data-tab="current-query"]'
        );
        const tabButtons = document.querySelectorAll(".pannel__tab");
        const tabContents = document.querySelectorAll(".pannel__tab-content");

        // 모든 탭 비활성화
        tabButtons.forEach((btn) => btn.classList.remove("is-active"));
        tabContents.forEach((content) => content.classList.remove("is-active"));

        // 현재 질의 설정 탭 활성화
        currentQueryTab.classList.add("is-active");
        const currentQueryContent = document.querySelector(
          '[data-content="current-query"]'
        );
        currentQueryContent.classList.add("is-active");
      });
    }
  }, 100);
}

function initTabSwitching() {
  const tabButtons = document.querySelectorAll(".pannel__tab");
  const tabContents = document.querySelectorAll(".pannel__tab-content");

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const targetTab = this.getAttribute("data-tab");

      // 모든 탭 버튼에서 active 클래스 제거
      tabButtons.forEach((btn) => {
        btn.classList.remove("is-active");
      });

      // 클릭한 탭 버튼에 active 클래스 추가
      this.classList.add("is-active");

      // 모든 탭 콘텐츠에서 active 클래스 제거
      tabContents.forEach((content) => {
        content.classList.remove("is-active");
      });

      // 해당하는 탭 콘텐츠에 active 클래스 추가
      const targetContent = document.querySelector(
        `[data-content="${targetTab}"]`
      );
      if (targetContent) {
        targetContent.classList.add("is-active");
      }
    });
  });
}

function addChatBubble(type, content) {
  const chatHistory = document.querySelector(".chat-container__history");
  const bubble = document.createElement("div");
  bubble.className = `chat-container__bubble--${type}`;
  bubble.innerHTML = content;
  chatHistory.appendChild(bubble);

  // 스크롤을 맨 아래로
  setTimeout(() => {
    chatHistory.scrollTop = chatHistory.scrollHeight;
  }, 100);
}

function addSQLQueryBubble(queryId, sqlQuery) {
  const content = `
    <div class="chat-container__bubble-header">
      <span>Claude Sonnet 4</span>
    </div>
    <div class="chat-container__bubble-content">
      <p>선택하신 테이블과 컬럼을 바탕으로 SQL 쿼리를 생성했습니다.</p>

      <div class="sql-block">
        <div class="sql-header">
          <span>생성된 SQL 구문</span>
          <div class="sql-actions">
            <button class="sql-btn sql-btn--edit" title="편집">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12.146 0.146a0.5 0.5 0 0 1 .708 0l3 3a0.5 0.5 0 0 1 0 .708L5.707 14H2v-3.707L12.146 0.146zM13 2.207L13.793 3 3 13.793V15h1.207L15 4.207 13 2.207zM2.5 11.5L4.5 13.5" stroke="currentColor" stroke-width="1.5" fill="none"/>
              </svg>
            </button>
            <button class="action-btn copy-btn" title="복사">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M13.5 2.5H6.5C5.94772 2.5 5.5 2.94772 5.5 3.5V4.5H4.5C3.94772 4.5 3.5 4.94772 3.5 5.5V12.5C3.5 13.0523 3.94772 13.5 4.5 13.5H11.5C12.0523 13.5 12.5 13.0523 12.5 12.5V11.5H13.5C14.0523 11.5 14.5 11.0523 14.5 10.5V3.5C14.5 2.94772 14.0523 2.5 13.5 2.5Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="sql-content">
          <pre class="sql-display"><code>${sqlQuery}</code></pre>
          <textarea class="sql-editor hidden" rows="6">${sqlQuery}</textarea>
        </div>
      </div>

      <div class="query-execution-section">
        <button type="button" class="btn btn--primary btn--md" data-query-id="${queryId}">
         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><g clip-path="url(#clip0_1049_20567)"><path d="M4.53091 4.78626L8.56486 7.35818L4.53091 9.93011V4.78626ZM3 2V12.7164L11.42 7.35818L3 2Z" fill="white"/></g><defs><clipPath id="clip0_1049_20567"><rect width="14" height="14" fill="white" /></clipPath></defs></svg><span>Generate Query</span>
        </button>
      </div>

      <div class="message-actions">
        <button class="action-btn copy-btn" title="복사">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M13.5 2.5H6.5C5.94772 2.5 5.5 2.94772 5.5 3.5V4.5H4.5C3.94772 4.5 3.5 4.94772 3.5 5.5V12.5C3.5 13.0523 3.94772 13.5 4.5 13.5H11.5C12.0523 13.5 12.5 13.0523 12.5 12.5V11.5H13.5C14.0523 11.5 14.5 11.0523 14.5 10.5V3.5C14.5 2.94772 14.0523 2.5 13.5 2.5Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
          </svg>
        </button>
        <button class="action-btn thumbs-up-btn" title="좋아요">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8.5 2.5C8.5 2.5 10 1 12 3.5C12 3.5 13.5 5 13.5 7.5C13.5 10 12 11.5 8.5 11.5H5.5C4.94772 11.5 4.5 11.0523 4.5 10.5V6.5C4.5 5.94772 4.94772 5.5 5.5 5.5H8.5V2.5Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
          </svg>
        </button>
        <button class="action-btn thumbs-down-btn" title="싫어요">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M7.5 13.5C7.5 13.5 6 15 4 12.5C4 12.5 2.5 11 2.5 8.5C2.5 6 4 4.5 7.5 4.5H10.5C11.0523 4.5 11.5 4.94772 11.5 5.5V9.5C11.5 10.0523 11.0523 10.5 10.5 10.5H7.5V13.5Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
          </svg>
        </button>
        <button class="action-btn refresh-btn" title="새로고침">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M13.5 8C13.5 11.0376 11.0376 13.5 8 13.5C4.96243 13.5 2.5 11.0376 2.5 8C2.5 4.96243 4.96243 2.5 8 2.5C9.5 2.5 10.8 3.2 11.7 4.3M11.5 2.5V4.5H9.5" stroke="currentColor" stroke-width="1.5" fill="none"/>
          </svg>
        </button>
      </div>
    </div>
  `;

  addChatBubble("asst", content);

  // 메인 실행 버튼에 이벤트 리스너 추가
  setTimeout(() => {
    const executeBtn = document.querySelector(`[data-query-id="${queryId}"]`);
    if (executeBtn) {
      executeBtn.addEventListener("click", function () {
        executeMainQuery(queryId, sqlQuery);
      });
    }

    // SQL 편집 기능 추가
    initSQLEditorForBubble();
  }, 100);
}

function executeMainQuery(queryId, sqlQuery) {
  // 쿼리 상태를 processing으로 변경
  updateQueryStatus(queryId, "processing");

  const content = `
    <div class="chat-container__bubble-header">
      <span>Claude Sonnet 4</span>
    </div>
    <div class="chat-container__bubble-content">
      <div class="sql-execution-status">
        <span class="status-icon processing">⏳</span>
        <span>SQL 쿼리를 실행 중입니다...</span>
      </div>
    </div>
  `;

  addChatBubble("asst", content);

  // 2초 후 실행 결과 표시
  setTimeout(() => {
    showQueryResult(queryId, sqlQuery);
  }, 2000);
}

function showQueryResult(queryId, sqlQuery) {
  // 쿼리 상태를 completed로 변경
  updateQueryStatus(queryId, "completed");

  const content = `
    <div class="chat-container__bubble-header">
      <span>Claude Sonnet 4</span>
    </div>
    <div class="chat-container__bubble-content">
      <div class="sql-execution-status">
        <span class="status-icon success">✓</span>
        <span>SQL이 성공적으로 실행되었습니다. (총 23건 조회)</span>
      </div>

      <div class="result-preview">
        <div class="result-header">
          <span>실행 결과 미리보기 (10건)</span>
          <div class="result-actions">
            <button class="btn-view-all">전체 결과 보기 (23건)</button>
            <button class="btn-visualize" data-query-id="${queryId}">시각화 요청</button>
          </div>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>발송자 이메일</th>
              <th>발송자명</th>
              <th>제목</th>
              <th>중요도</th>
              <th>수신일시</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>ceo@company.com</td>
              <td>김대표</td>
              <td>[긴급] Q2 실적 검토 회의</td>
              <td>URGENT</td>
              <td>2024-06-03 09:15</td>
            </tr>
            <tr>
              <td>hr@company.com</td>
              <td>인사팀</td>
              <td>임원진 회의 일정 변경</td>
              <td>HIGH</td>
              <td>2024-06-04 16:20</td>
            </tr>
            <tr>
              <td>finance@company.com</td>
              <td>재무팀</td>
              <td>예산 승인 요청</td>
              <td>URGENT</td>
              <td>2024-06-06 10:30</td>
            </tr>
            <tr>
              <td>client@partner.co.kr</td>
              <td>박고객</td>
              <td>계약서 검토 요청</td>
              <td>HIGH</td>
              <td>2024-06-02 11:45</td>
            </tr>
            <tr>
              <td>marketing@company.com</td>
              <td>마케팅팀</td>
              <td>캠페인 결과 보고</td>
              <td>HIGH</td>
              <td>2024-06-07 14:15</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="message-actions">
        <button class="action-btn copy-btn" title="복사">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M13.5 2.5H6.5C5.94772 2.5 5.5 2.94772 5.5 3.5V4.5H4.5C3.94772 4.5 3.5 4.94772 3.5 5.5V12.5C3.5 13.0523 3.94772 13.5 4.5 13.5H11.5C12.0523 13.5 12.5 13.0523 12.5 12.5V11.5H13.5C14.0523 11.5 14.5 11.0523 14.5 10.5V3.5C14.5 2.94772 14.0523 2.5 13.5 2.5Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
          </svg>
        </button>
        <button class="action-btn thumbs-up-btn" title="좋아요">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8.5 2.5C8.5 2.5 10 1 12 3.5C12 3.5 13.5 5 13.5 7.5C13.5 10 12 11.5 8.5 11.5H5.5C4.94772 11.5 4.5 11.0523 4.5 10.5V6.5C4.5 5.94772 4.94772 5.5 5.5 5.5H8.5V2.5Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
          </svg>
        </button>
        <button class="action-btn thumbs-down-btn" title="싫어요">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M7.5 13.5C7.5 13.5 6 15 4 12.5C4 12.5 2.5 11 2.5 8.5C2.5 6 4 4.5 7.5 4.5H10.5C11.0523 4.5 11.5 4.94772 11.5 5.5V9.5C11.5 10.0523 11.0523 10.5 10.5 10.5H7.5V13.5Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
          </svg>
        </button>
        <button class="action-btn refresh-btn" title="새로고침">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M13.5 8C13.5 11.0376 11.0376 13.5 8 13.5C4.96243 13.5 2.5 11.0376 2.5 8C2.5 4.96243 4.96243 2.5 8 2.5C9.5 2.5 10.8 3.2 11.7 4.3M11.5 2.5V4.5H9.5" stroke="currentColor" stroke-width="1.5" fill="none"/>
          </svg>
        </button>
      </div>
    </div>
  `;

  addChatBubble("asst", content);
}

function initSQLEditorForBubble() {
  const editBtns = document.querySelectorAll(
    ".sql-btn--edit:not(.initialized)"
  );

  editBtns.forEach((editBtn) => {
    editBtn.classList.add("initialized");
    const sqlBlock = editBtn.closest(".sql-block");
    const sqlDisplay = sqlBlock.querySelector(".sql-display");
    const sqlEditor = sqlBlock.querySelector(".sql-editor");

    // 편집 아이콘 SVG
    const editIcon = editBtn.innerHTML;

    // 완료 아이콘 SVG
    const checkIcon =
      '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13.5 3.5L6 11l-3.5-3.5" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';

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

        this.innerHTML = editIcon;
        this.title = "편집";
      } else {
        // 읽기 모드 → 편집 모드
        sqlDisplay.classList.add("hidden");
        sqlEditor.classList.remove("hidden");
        sqlEditor.focus();

        this.innerHTML = checkIcon;
        this.title = "완료";
      }
    });
  });
}

function addQueryToHistory(query, status = "pending") {
  const queryId = queryIdCounter++;
  const queryItem = {
    id: queryId,
    query: query,
    status: status,
    timestamp: new Date(),
    title: generateQueryTitle(query),
  };

  queryHistory.push(queryItem);
  updateQueryHistoryUI();
  return queryId;
}

function updateQueryStatus(queryId, status) {
  const queryItem = queryHistory.find((q) => q.id === queryId);
  if (queryItem) {
    queryItem.status = status;
    updateQueryHistoryUI();
  }
}

function generateQueryTitle(query) {
  // 사용자 질의 또는 SQL 쿼리에서 간단한 제목 생성
  if (currentUserQuery) {
    // 사용자 질의가 있으면 그것을 기반으로 제목 생성
    const userQuery = currentUserQuery.toLowerCase();
    if (userQuery.includes("이메일") || userQuery.includes("email")) {
      return "이메일 데이터 조회";
    } else if (userQuery.includes("사용자") || userQuery.includes("user")) {
      return "사용자 데이터 조회";
    } else if (userQuery.includes("부서") || userQuery.includes("department")) {
      return "부서 데이터 조회";
    } else if (
      userQuery.includes("중요") ||
      userQuery.includes("urgent") ||
      userQuery.includes("high")
    ) {
      return "중요 데이터 조회";
    } else if (
      userQuery.includes("월") ||
      userQuery.includes("주") ||
      userQuery.includes("일")
    ) {
      return "기간별 데이터 조회";
    }

    // 사용자 질의를 요약하여 제목으로 사용 (최대 20자)
    const shortTitle =
      currentUserQuery.length > 20
        ? currentUserQuery.substring(0, 20) + "..."
        : currentUserQuery;
    return shortTitle;
  }

  // SQL 쿼리에서 제목 생성 (fallback)
  const lowerQuery = query.toLowerCase();
  if (lowerQuery.includes("emails")) {
    return "이메일 데이터 조회";
  } else if (lowerQuery.includes("users")) {
    return "사용자 데이터 조회";
  } else if (lowerQuery.includes("departments")) {
    return "부서 데이터 조회";
  }

  return "SQL 쿼리";
}

function updateQueryHistoryUI() {
  const queryList = document.querySelector(".pannel__inner__query-list");
  if (!queryList) return;

  queryList.innerHTML = "";

  queryHistory.forEach((queryItem) => {
    const statusClass =
      queryItem.status === "completed"
        ? "completed"
        : queryItem.status === "processing"
          ? "processing"
          : "pending";

    const statusText =
      queryItem.status === "completed"
        ? "Completed"
        : queryItem.status === "processing"
          ? "Processing"
          : "Pending";

    const visualizeButton =
      queryItem.status === "completed"
        ? `<button class="pannel__inner__query-action">Visualize</button>`
        : "";

    const queryHTML = `
      <div class="pannel__inner__query-item">
        <div class="pannel__inner__query-header">
          <div class="pannel__inner__query-title">
            <span class="pannel__inner__query-number">#${queryItem.id}</span>
            <span>${queryItem.title}</span>
          </div>
          <div class="pannel__inner__query-status pannel__inner__query-status--${statusClass}">
            <div class="pannel__inner__status-icon"></div>
            <span>${statusText}</span>
          </div>
          <button class="pannel__inner__query-expand">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4.43065 5.33334L8.00065 9.04185L11.5707 5.33334L12.6673 6.47504L8.00065 11.3333L3.33398 6.47504L4.43065 5.33334Z" fill="#0F172A"/>
            </svg>
          </button>
        </div>
        <div class="pannel__inner__query-details">
          <div class="pannel__inner__query-section">
            <h5 class="pannel__inner__query-section-title">SQL Query</h5>
            <pre class="pannel__inner__query-code">${queryItem.query}</pre>
          </div>
          <div class="pannel__inner__query-actions">
            <button class="pannel__inner__query-action">View Results</button>
            ${visualizeButton}
          </div>
        </div>
      </div>
    `;

    queryList.innerHTML += queryHTML;
  });

  // 펼침/접기 기능 추가
  setTimeout(() => {
    const expandButtons = document.querySelectorAll(
      ".pannel__inner__query-expand"
    );
    expandButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const queryItem = this.closest(".pannel__inner__query-item");
        const details = queryItem.querySelector(
          ".pannel__inner__query-details"
        );
        const isExpanded = details.style.display === "block";

        if (isExpanded) {
          details.style.display = "none";
          this.style.transform = "rotate(0deg)";
        } else {
          details.style.display = "block";
          this.style.transform = "rotate(180deg)";
        }
      });
    });
  }, 100);
}

function initQueryHistory() {
  // 하드코딩된 Query History 항목들에 펼침/접기 기능 추가
  const expandButtons = document.querySelectorAll(
    ".pannel__inner__query-expand"
  );

  expandButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const queryItem = this.closest(".pannel__inner__query-item");
      const details = queryItem.querySelector(".pannel__inner__query-details");
      const isExpanded = details.style.display === "block";

      // 토글
      details.style.display = isExpanded ? "none" : "block";

      // 화살표 회전
      this.style.transform = isExpanded ? "rotate(0deg)" : "rotate(180deg)";
    });
  });
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

function initAutoResizeTextarea() {
  const textarea = document.querySelector(".chat-input__input > textarea");

  if (textarea) {
    // 자동 높이 조정 함수
    function autoResize() {
      // 높이를 초기화하여 정확한 scrollHeight를 얻음
      textarea.style.height = "auto";

      // 최소/최대 높이 계산
      const minHeight = 24; // min-height와 동일
      const maxHeight = 320; // max-height와 동일
      const scrollHeight = textarea.scrollHeight;

      // 새 높이 계산 (최소/최대 범위 내에서)
      const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);

      // 높이 적용
      textarea.style.height = newHeight + "px";

      // 최대 높이에 도달했을 때만 스크롤 표시
      if (scrollHeight > maxHeight) {
        textarea.style.overflowY = "auto";
      } else {
        textarea.style.overflowY = "hidden";
      }
    }

    // 이벤트 리스너 추가
    textarea.addEventListener("input", autoResize);
    textarea.addEventListener("paste", function () {
      // paste 이벤트는 약간의 지연 후 처리
      setTimeout(autoResize, 10);
    });

    // 초기 높이 설정
    autoResize();
  }
}

function initCurrentQuerySettings() {
  const tableSelect = document.getElementById("tableSelect");
  const columnSelection = document.getElementById("columnSelection");
  const applySelectionBtn = document.getElementById("applySelectionBtn");

  // 테이블 선택 변경 시 컬럼 표시/숨김
  if (tableSelect) {
    tableSelect.addEventListener("change", function () {
      const selectedTables = Array.from(this.selectedOptions).map(
        (option) => option.value
      );
      updateColumnVisibility(selectedTables);
    });
  }

  // 적용 버튼 클릭 시 SQL 쿼리 생성하여 메인 화면에 추가
  if (applySelectionBtn) {
    applySelectionBtn.addEventListener("click", function () {
      const selectedTables = Array.from(tableSelect.selectedOptions).map(
        (option) => option.value
      );
      const checkedColumns = [];

      // 선택된 컬럼들 수집
      selectedTables.forEach((tableName) => {
        const tableColumns = document.querySelector(
          `[data-table="${tableName}"]`
        );
        if (tableColumns && !tableColumns.classList.contains("hidden")) {
          const checkboxes = tableColumns.querySelectorAll(
            'input[type="checkbox"]:checked'
          );
          checkboxes.forEach((checkbox) => {
            const columnName = checkbox.name; // 전체 이름 사용 (emails.sender_email)
            checkedColumns.push(columnName);
          });
        }
      });

      // 테이블이나 컬럼이 선택되지 않은 경우
      if (selectedTables.length === 0) {
        alert("테이블을 선택해주세요.");
        return;
      }
      if (checkedColumns.length === 0) {
        alert("컬럼을 선택해주세요.");
        return;
      }

      // SQL 쿼리 생성
      const query = generateSQLQuery(selectedTables, checkedColumns);

      // 쿼리를 히스토리에 추가하고 메인 화면에 표시
      const queryId = addQueryToHistory(query, "pending");
      addSQLQueryBubble(queryId, query);

      // 버튼 상태 업데이트
      this.innerHTML =
        '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12 5l-8 8-4-4" stroke="currentColor" stroke-width="2" fill="none"/></svg> 쿼리 생성 완료';
      this.disabled = true;

      setTimeout(() => {
        this.innerHTML = "Apply Selection";
        this.disabled = false;
      }, 2000);
    });
  }

  function generateSQLQuery(tables, columns) {
    // 사용자 질의를 고려한 더 지능적인 쿼리 생성
    let query = `SELECT ${columns.join(", ")}\nFROM ${tables.join(", ")}`;

    // 사용자 질의에 따른 조건 추가
    if (currentUserQuery) {
      const userQueryLower = currentUserQuery.toLowerCase();

      // 날짜 관련 조건
      if (userQueryLower.includes("6월") || userQueryLower.includes("june")) {
        if (
          columns.some(
            (col) => col.includes("received_date") || col.includes("date")
          )
        ) {
          query += `\nWHERE received_date BETWEEN '2024-06-01' AND '2024-06-30'`;
        }
      }

      // 중요도 관련 조건
      if (
        userQueryLower.includes("중요") ||
        userQueryLower.includes("urgent") ||
        userQueryLower.includes("high")
      ) {
        if (columns.some((col) => col.includes("importance_level"))) {
          if (query.includes("WHERE")) {
            query += `\n  AND importance_level IN ('HIGH', 'URGENT')`;
          } else {
            query += `\nWHERE importance_level IN ('HIGH', 'URGENT')`;
          }
        }
      }

      // 정렬 조건
      if (
        userQueryLower.includes("발송자") ||
        userQueryLower.includes("sender")
      ) {
        if (columns.some((col) => col.includes("sender"))) {
          query += `\nORDER BY sender_email, received_date DESC`;
        }
      } else if (columns.some((col) => col.includes("date"))) {
        query += `\nORDER BY received_date DESC`;
      }
    }

    query += `\nLIMIT 100;`;
    return query;
  }

  function updateColumnVisibility(selectedTables) {
    const allTableColumns = document.querySelectorAll(
      ".sql-builder__column-table"
    );

    allTableColumns.forEach((tableColumn) => {
      const tableName = tableColumn.getAttribute("data-table");
      if (selectedTables.includes(tableName)) {
        tableColumn.classList.remove("is-hidden");
      } else {
        tableColumn.classList.add("is-hidden");
      }
    });
  }

  // 초기 로드 시 실행
  updateColumnVisibility(["emails"]);
}
