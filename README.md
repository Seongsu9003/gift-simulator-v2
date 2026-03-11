# 🧳 아빠의 '서른 살엔 독립해라' 계산기 (Gift Simulator)

> 자녀의 독립 자금, 복리와 절세 전략으로 체계적으로 준비할 수 있도록 돕는 자녀 자산 시뮬레이터입니다.

[![Version](https://img.shields.io/badge/version-v1.6.0-blue)](#)
[![Web](https://img.shields.io/badge/Web-Vercel-black?logo=vercel)](#)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](#)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](#)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](#)

## 💡 기획 의도 (Concept)
자녀에게 든든한 목돈을 준비해 주고 싶지만, 동시에 **"성인이 되면 반드시 독립시키겠다"**는 확고한 의지를 가진 부모님들을 위해 기획되었습니다.
단순한 계산기를 넘어, 물가 상승의 현실을 직시하고 복리 운용과 합법적인 절세 전략을 함께 시뮬레이션할 수 있는 종합 대시보드입니다.

## 🚀 데모 확인하기
👉 **[여기를 눌러 라이브 서비스 체험하기](https://gift-simulator-v2.vercel.app/)**

---

## ✨ 핵심 기능 (Core Features)

### 1. 📈 듀얼 복리 시뮬레이션
* **거치식 + 적립식 합산:** 미리 신고해 둔 '씨드머니'가 굴러가는 가치와 '매월 납입금'이 굴러가는 가치를 분리 계산 후 합산하여 현실적인 예상 자산을 도출합니다.
* **S&P 500 연평균 수익률(10.5%)** 기준의 직관적인 자산 성장 그래프를 제공합니다.

### 2. 📉 목표 가치 계산 (인플레이션 반영)
* 사용자가 선택한 미래 선물(학자금, 주택마련 씨드머니 등)에 **연 3.5%(최근 3년 평균)의 물가상승률을 복리로 적용**하여 예상 미래 가격을 산출합니다.
* 시뮬레이션 결과와 선물의 미래 가격을 비교하여 목표 달성 여부에 따른 **맞춤형 결과 메시지**를 출력합니다.

### 3. 🗓 증여세 비과세 마일스톤 타임라인
* **10년 주기 증여세 비과세 한도**(미성년자 2천만 원, 성인 5천만 원)를 첫 증여 신고 시점을 기준으로 자동 계산하여 타임라인 카드 형태로 시각화합니다.
* 현재 진행 중인 주기의 잔여 한도와 추가 증여 가능 여부를 안내합니다.
* **유기정기금 3% 비과세 최대 월납입액**을 자동 계산하여 표시합니다. (연차별 할인합산 방식 + 과세미달 기준 적용, 미성년 10년 기준 월 19만 4천 원)

### 4. 📊 직관적인 데이터 시각화
* `Chart.js`를 활용하여 아이의 나이(X축)에 따른 시뮬레이션 자산과 목표 금액의 성장 추이를 차트로 보여줍니다.

### 5. 📄 증여 확약서 이미지 다운로드
* 시뮬레이션 결과를 바탕으로 **증여 확약서 이미지(.png)를 생성하여 다운로드**할 수 있습니다.
* `html2canvas` 라이브러리를 활용하며, 목표 자산·선물 이름·날짜 등이 포함된 증거 문서로 활용할 수 있습니다.

---

## 🛠 기술 스택 (Tech Stack)

* **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+)
* **Data Visualization:** Chart.js
* **Image Export:** html2canvas
* **Typography:** Pretendard
* **Deployment:** Vercel

---

## 📁 프로젝트 구조 (Folder Structure)

```bash
📦 gift-simulator-v2
 ┣ 📜 index.html    # 메인 구조 및 레이아웃
 ┣ 📜 style.css     # UI/UX 스타일링 (반응형)
 ┣ 📜 script.js     # 복리/물가 계산, 증여 스케줄 로직, 차트 렌더링
 ┗ 📜 README.md     # 프로젝트 소개 문서
```

---

## 👨‍💻 로컬 실행 방법 (Getting Started)

별도의 패키지 설치 없이, 웹 브라우저만 있으면 바로 실행 가능합니다.

1. 저장소를 클론(Clone) 합니다.
   ```bash
   git clone https://github.com/Seongsu9003/gift-simulator-v2.git
   ```
2. 프로젝트 폴더로 이동합니다.
   ```bash
   cd gift-simulator-v2
   ```
3. `index.html` 파일을 크롬, 사파리 등의 웹 브라우저로 엽니다. (또는 VS Code의 Live Server 확장 프로그램 사용)

---

> **Note:** 본 서비스의 계산 결과는 시뮬레이션을 위한 참고용이며, 실제 금융 상품의 수익률이나 국세청의 정확한 세금 부과 기준과 차이가 있을 수 있습니다.
