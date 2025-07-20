// 메인 페이지 JavaScript - main.js

document.addEventListener("DOMContentLoaded", function () {
  console.log("메인 페이지 스크립트 로드 완료");

  // 시작하기 버튼 이벤트
  initCTAButton();

  // 카드 애니메이션
  initCardAnimations();

  // 스무스 스크롤
  initSmoothScroll();
});

// CTA 버튼 초기화
function initCTAButton() {
  const ctaButton = document.querySelector(".cta-button");

  if (ctaButton) {
    ctaButton.addEventListener("click", function () {
      // 서비스 섹션으로 스크롤
      const aboutSection = document.querySelector("#about");
      if (aboutSection) {
        aboutSection.scrollIntoView({
          behavior: "smooth",
        });
      }

      Utils.showMessage("서비스 소개로 이동합니다!");
    });
  }
}

// 카드 애니메이션 초기화
function initCardAnimations() {
  const cards = document.querySelectorAll(".card");

  // Intersection Observer로 스크롤 애니메이션
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  cards.forEach((card, index) => {
    // 초기 상태 설정
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;

    // 관찰 시작
    observer.observe(card);

    // 클릭 이벤트 추가
    card.addEventListener("click", function () {
      const title = this.querySelector("h3").textContent;
      Utils.showMessage(`${title}에 대해 더 자세히 알아보세요!`);
    });
  });
}

// 스무스 스크롤 초기화
function initSmoothScroll() {
  const navLinks = document.querySelectorAll('.nav a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

// 페이지 로드 시 환영 메시지 (선택사항)
window.addEventListener("load", function () {
  setTimeout(() => {
    Utils.showMessage("AACA에 오신 것을 환영합니다! 🎉");
  }, 1000);
});
