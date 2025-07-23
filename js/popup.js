function openPopup() {
  document.getElementById("popup").style.display = "flex";
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
}

// 바깥 영역 클릭 시 팝업 닫기
function backgroundClick(e) {
  if (e.target.classList.contains("popup-overlay")) {
    closePopup();
  }
}
