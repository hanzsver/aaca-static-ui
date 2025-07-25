// 로그인 페이지 JavaScript - login.js

document.addEventListener("DOMContentLoaded", function () {
  console.log("로그인 페이지 스크립트 로드 완료");

  // 로그인 폼 초기화
  initLoginForm();

  // 입력 필드 애니메이션
  initInputAnimations();
});

// 로그인 폼 초기화
function initLoginForm() {
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const remember = document.getElementById("remember").checked;

      // 유효성 검사
      if (!validateLoginForm(email, password)) {
        return;
      }

      // 로그인 처리 시뮬레이션
      handleLogin(email, password, remember);
    });
  }
}

// 로그인 폼 유효성 검사
function validateLoginForm(email, password) {
  // 이메일 검사
  if (!email) {
    Utils.showMessage("이메일을 입력해주세요.", "error");
    document.getElementById("email").focus();
    return false;
  }

  if (!Utils.validateEmail(email)) {
    Utils.showMessage("올바른 이메일 형식을 입력해주세요.", "error");
    document.getElementById("email").focus();
    return false;
  }

  // 비밀번호 검사
  if (!password) {
    Utils.showMessage("비밀번호를 입력해주세요.", "error");
    document.getElementById("password").focus();
    return false;
  }

  if (!Utils.validatePassword(password)) {
    Utils.showMessage("비밀번호는 최소 6자 이상이어야 합니다.", "error");
    document.getElementById("password").focus();
    return false;
  }

  return true;
}

// 로그인 처리 (시뮬레이션)
function handleLogin(email, password, remember) {
  const loginButton = document.querySelector(".login-button");
  const originalText = loginButton.textContent;

  // 로딩 상태
  loginButton.textContent = "로그인 중...";
  loginButton.disabled = true;

  // 로그인 시뮬레이션 (2초 후)
  setTimeout(() => {
    // 데모용 계정 검사
    if (email === "demo@aaca.com" && password === "demo123") {
      Utils.showMessage("로그인 성공! 메인 페이지로 이동합니다.");

      // 로그인 상태 저장 (데모용)
      if (remember) {
        localStorage.setItem("aaca_remember", "true");
        localStorage.setItem("aaca_email", email);
      }

      // 메인 페이지로 이동
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);
    } else {
      Utils.showMessage("이메일 또는 비밀번호가 올바르지 않습니다.", "error");
    }

    // 버튼 상태 복원
    loginButton.textContent = originalText;
    loginButton.disabled = false;
  }, 2000);
}

// 입력 필드 애니메이션
function initInputAnimations() {
  const inputs = document.querySelectorAll(".form-group input");

  inputs.forEach((input) => {
    // 포커스 애니메이션
    input.addEventListener("focus", function () {
      this.parentElement.classList.add("focused");
    });

    input.addEventListener("blur", function () {
      if (!this.value) {
        this.parentElement.classList.remove("focused");
      }
    });

    // 실시간 유효성 검사
    input.addEventListener("input", function () {
      const isValid = validateField(this);

      if (isValid) {
        this.style.borderColor = "#28a745";
      } else {
        this.style.borderColor = "#dc3545";
      }
    });
  });

  // 기억된 이메일 복원
  const rememberedEmail = localStorage.getItem("aaca_email");
  if (rememberedEmail && localStorage.getItem("aaca_remember")) {
    document.getElementById("email").value = rememberedEmail;
    document.getElementById("remember").checked = true;
  }
}

// 개별 필드 유효성 검사
function validateField(field) {
  const value = field.value.trim();

  switch (field.type) {
    case "email":
      return Utils.validateEmail(value);
    case "password":
      return Utils.validatePassword(value);
    default:
      return value.length > 0;
  }
}

// 비밀번호 찾기 링크 처리
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("forgot-password")) {
    e.preventDefault();
    Utils.showMessage("비밀번호 찾기 기능은 준비 중입니다.");
  }

  if (e.target.closest(".signup-link a")) {
    e.preventDefault();
    Utils.showMessage("회원가입 기능은 준비 중입니다.");
  }
});

// CSS 추가 (입력 필드 애니메이션)
const style = document.createElement("style");
style.textContent = `
    .form-group.focused label {
        color: #007bff;
        transform: translateY(-5px);
    }
    
    .form-group label {
        transition: all 0.3s ease;
    }
`;
document.head.appendChild(style);
