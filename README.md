# 🧳 아빠의 '서른 살엔 독립해라' 계산기 (Gift Simulator)

> "우리아이 독립 자금, 복리와 절세로 완벽하게 준비하자!" <br>
> K-부모님의 따뜻한 사랑과 팩트 폭격이 공존하는 자녀 자산 시뮬레이터 💸

[![Web](https://img.shields.io/badge/Web-Vercel-black?logo=vercel)](#) 
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](#)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](#)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](#)

## 💡 기획 의도 (Concept)
자녀에게 든든한 목돈을 쥐여주고 싶지만, 동시에 **"성인이 되면 반드시 독립시키겠다"**는 확고한 의지를 가진 부모님들을 위해 기획되었습니다. 
딱딱한 금융 계산기를 넘어, 츤데레 부모님의 유쾌한 팩트 폭격 편지와 함께 현실적인 물가 상승의 벽을 체감할 수 있는 맞춤형 대시보드입니다.

## 🚀 데모 확인하기
👉 **[여기를 눌러 라이브 서비스 체험하기](https://여러분의-vercel-주소를-여기에-넣어주세요.vercel.app/)**

---

## ✨ 핵심 기능 (Core Features)

### 1. 📈 듀얼 복리 시뮬레이션
* **거치식 + 적립식 합산:** 미리 신고해 둔 '씨드머니'가 굴러가는 가치와 '매월 납입금'이 굴러가는 가치를 분리 계산 후 합산하여 현실적인 예상 자산을 도출합니다.
* **S&P 500 연평균 수익률(10.5%)** 기준의 직관적인 자산 성장 그래프를 제공합니다.

### 2. 🥊 인플레이션 펀치 (목표 가치 계산)
* 사용자가 선택한 아이의 미래 선물(학자금, 주택마련 씨드머니 등)에 **연 3.5%(최근 3년 평균)의 물가상승률을 복리로 적용**하여, 훗날 실제로 필요해질 '무자비한 미래 가격'을 계산합니다.
* 아빠의 펀드 자금과 선물의 미래 가격을 비교하여 성공/실패 여부에 따른 **동적 결과 메시지(편지)**를 출력합니다.

### 3. 🚨 증여세 비과세 마일스톤 자동 계산
* 가장 헷갈리기 쉬운 **10년 주기 증여세 비과세 한도**(미성년자 2천만 원, 성인 5천만 원)를 아이의 나이와 첫 증여 시점을 기준으로 자동 계산합니다.
* 현재 나이가 주기 내에 속해 있고 한도가 남아있다면 **"추가 비과세 황금 타이밍"**을 적극적으로 알려줍니다.

### 4. 📊 직관적인 데이터 시각화
* `Chart.js`를 활용하여 아이의 나이(X축)에 따른 아빠의 펀드 자금과 목표 금액의 격차를 실시간 레이스 차트로 보여줍니다.

---

## 🛠 기술 스택 (Tech Stack)

* **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+)
* **Data Visualization:** Chart.js
* **Typography:** Pretendard
* **Deployment:** Vercel

---

## 📁 프로젝트 구조 (Folder Structure)

\`\`\`bash
📦 gift-simulator-v2
 ┣ 📜 index.html    # 메인 구조 및 레이아웃
 ┣ 📜 style.css     # UI/UX 스타일링 (반응형 및 Material Design 감성)
 ┣ 📜 script.js     # 복리/물가 계산, 증여 스케줄 로직, 차트 렌더링
 ┗ 📜 README.md     # 프로젝트 소개 문서
\`\`\`

---

## 👨‍💻 로컬 실행 방법 (Getting Started)

별도의 패키지 설치 없이, 웹 브라우저만 있으면 바로 실행 가능합니다.

1. 저장소를 클론(Clone) 합니다.
   \`\`\`bash
   git clone https://github.com/Seongsu9003/gift-simulator-v2.git
   \`\`\`
2. 프로젝트 폴더로 이동합니다.
   \`\`\`bash
   cd gift-simulator-v2
   \`\`\`
3. `index.html` 파일을 크롬, 사파리 등의 웹 브라우저로 엽니다. (또는 VS Code의 Live Server 확장 프로그램 사용)

---

> **Note:** 본 서비스의 계산 결과는 시뮬레이션을 위한 참고용이며, 실제 금융 상품의 수익률이나 국세청의 정확한 세금 부과 기준과 차이가 있을 수 있습니다.