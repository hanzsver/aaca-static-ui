# AACA 정적 웹사이트

HTML, CSS, JavaScript를 사용한 컴포넌트화를 최소화한 정적 웹사이트입니다.

## 📁 폴더 구조

```
aaca-static-ui/
│   ├── chat/
│   │   └── index.html        # CHAT 카테고리 상세 페이지
│   ├── doc/
│   │   └── index.html        # DOC 카테고리 상세 페이지
│   └── sql/
│       └── index.html        # SQL 카테고리 상세 페이지
├── assets/                   # 정적 자원(공통)
│   ├── css/
│   │   ├── main.css
│   │   └── popup.css
│   ├── js/
│   │   ├── common.js
│   │   └── popup.js
│   └── images/               # 이미지 파일 저장소
└── README.md                 # 프로젝트 설명 파일
```

## 🚀 사용 방법

**파일 열기**: `pages/index.html` 파일을 웹브라우저에서 열어보세요.

## 🔧 확장 방법

1. **새 페이지 추가**: 루트에 새 HTML 파일 생성
2. **스타일 추가**: `css/` 폴더에 새 CSS 파일 생성
3. **기능 추가**: `js/` 폴더에 새 JavaScript 파일 생성
4. **이미지 추가**: `images/` 폴더에 이미지 파일 저장

## 📝 참고사항

- 이 프로젝트는 정적 HTML 사이트로 별도의 서버나 빌드 도구가 필요하지 않습니다.
- 웹브라우저에서 바로 파일을 열어 확인할 수 있습니다.
- 모든 기능은 바닐라 JavaScript로 구현되어 의존성이 없습니다.
