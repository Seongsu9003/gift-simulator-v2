document.addEventListener('DOMContentLoaded', () => {
    let myChart = null;

    // DOM 요소 캐싱 (미리 찾아두기)
    const radioSeedYes = document.getElementById('seedYes');
    const radioSeedNo = document.getElementById('seedNo');
    const seedAmountGroup = document.getElementById('seedAmountGroup');
    const btnCalculate = document.getElementById('btnCalculate');

    // ── 한글 요약 금액 (백만 단위 절삭) ─────────────────────
    function formatApproximateCurrency(num) {
        if (!num || num <= 0) return '';

        const truncated = Math.floor(num / 1000000); // 백만 단위 이하 절삭
        if (truncated === 0) return '';

        const eok = Math.floor(truncated / 100);      // 억 단위
        const man = (truncated % 100) * 100;          // 만 단위 (65백만 → 6,500만)

        const parts = [];
        if (eok > 0) parts.push(eok.toLocaleString() + '억');
        if (man > 0) parts.push(man.toLocaleString() + '만');

        if (parts.length === 0) return '';
        return '약 ' + parts.join(' ') + ' 원';
    }

    // ── 한글 금액 변환 유틸리티 ──────────────────────────
    function formatKoreanAmount(value) {
        const num = Math.floor(parseFloat(value));
        if (!value || isNaN(num) || num <= 0) return '';

        const eok  = Math.floor(num / 100000000);           // 억 단위
        const man  = Math.floor((num % 100000000) / 10000); // 만 단위
        const rest = num % 10000;                           // 나머지 (천~일)

        const parts = [];
        if (eok  > 0) parts.push(eok.toLocaleString()  + '억');
        if (man  > 0) parts.push(man.toLocaleString()  + '만');
        if (rest > 0) parts.push(rest.toLocaleString());    // 숫자만, 뒤에 원 붙임

        if (parts.length === 0) return '≈ ' + num.toLocaleString() + '원';
        return '≈ ' + parts.join(' ') + '원';
    }

    function updateHelper(inputEl, helperEl) {
        helperEl.textContent = formatKoreanAmount(inputEl.value);
    }

    // 헬퍼 대상 요소
    const seedAmountInput = document.getElementById('seedAmount');
    const seedAmountHelper = document.getElementById('seedAmountHelper');
    const monthlyInput = document.getElementById('monthly');
    const monthlyHelper = document.getElementById('monthlyHelper');

    // 실시간 이벤트
    seedAmountInput.addEventListener('input', () => updateHelper(seedAmountInput, seedAmountHelper));
    monthlyInput.addEventListener('input', () => updateHelper(monthlyInput, monthlyHelper));

    // 초기값 표시
    updateHelper(seedAmountInput, seedAmountHelper);
    updateHelper(monthlyInput, monthlyHelper);
    // ─────────────────────────────────────────────────────

    // 이벤트 리스너 등록
    radioSeedYes.addEventListener('change', toggleSeedInput);
    radioSeedNo.addEventListener('change', toggleSeedInput);
    btnCalculate.addEventListener('click', calculate);
    document.getElementById('btnDownload').addEventListener('click', downloadCertificate);

    // [New] 목표 선물 카드 선택 로직
    const giftCards = document.querySelectorAll('.gift-card');
    const giftSelect = document.getElementById('gift');

    giftCards.forEach(card => {
        card.addEventListener('click', () => {
            // 1. 시각적 선택 상태 변경
            giftCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');

            // 2. 숨겨진 Select 값 업데이트
            const value = card.getAttribute('data-value');
            giftSelect.value = value;
        });
    });

    // ── 확약서 이미지 다운로드 ─────────────────────────────
    async function downloadCertificate() {
        // 1. 결과값 채우기
        document.getElementById('capTargetAge').textContent     = document.getElementById('resTargetAgeText').textContent;
        document.getElementById('capFuture').textContent        = document.getElementById('resFuture').textContent;
        document.getElementById('capFutureApprox').textContent  = document.getElementById('resFutureApprox').textContent;
        document.getElementById('capGoal').textContent          = document.getElementById('resGoal').textContent;
        document.getElementById('capGoalApprox').textContent    = document.getElementById('resGoalApprox').textContent;
        document.getElementById('capDate').textContent          = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });

        // 2. 차트 캔버스를 이미지로 변환
        document.getElementById('capChartImg').src = document.getElementById('growthChart').toDataURL('image/png');

        // 3. 템플릿을 잠시 화면에 노출 (html2canvas 렌더링을 위해)
        const template = document.getElementById('captureTemplate');
        template.style.left = '0';

        try {
            // 4. html2canvas 캡처
            const canvas = await html2canvas(document.getElementById('certCard'), {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                logging: false
            });

            // 5. 다운로드
            const link = document.createElement('a');
            link.download = 'tabuji-promise.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        } finally {
            // 6. 템플릿 다시 숨기기
            template.style.left = '-9999px';
        }
    }
    // ─────────────────────────────────────────────────────

    // 씨드머니 입력창 토글 함수
    function toggleSeedInput() {
        const hasSeed = radioSeedYes.checked;
        seedAmountGroup.style.display = hasSeed ? 'block' : 'none';
    }

    // 메인 계산 로직
    function calculate() {
        const hasSeed = radioSeedYes.checked;
        const seedAmount = hasSeed ? parseFloat(document.getElementById('seedAmount').value) : 0;
        const seedAge = hasSeed ? parseInt(document.getElementById('seedAge').value) : null;

        const currentAge = parseInt(document.getElementById('currentAge').value);
        const targetAge = parseInt(document.getElementById('targetAge').value);
        
        if (targetAge <= currentAge) {
            alert("독립 나이는 현재 나이보다 커야 합니다! 다시 입력해 주세요.");
            return;
        }

        if (hasSeed && (seedAge === null || seedAge > currentAge)) {
            alert("증여 신고 나이는 아이의 현재 나이보다 작거나 같아야 합니다!");
            return;
        }
        
        const years = targetAge - currentAge;
        const monthly = parseFloat(document.getElementById('monthly').value);
        const rate = parseFloat(document.getElementById('rate').value) / 100;
        const inflation = parseFloat(document.getElementById('inflation').value) / 100;
        
        const giftSelect = document.getElementById('gift');
        const giftCurrentValue = parseFloat(giftSelect.value);
        const giftName = giftSelect.options[giftSelect.selectedIndex].text.split(' (')[0]; 

        const monthlyRate = rate / 12;
        const totalMonths = years * 12;
        
        // 거치식 + 적립식 복리
        let fvSeed = seedAmount * Math.pow(1 + monthlyRate, totalMonths);
        let fvMonthly = monthlyRate === 0 ? (monthly * totalMonths) : monthly * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
        let finalFutureValue = fvSeed + fvMonthly;
        
        // 선물의 미래 가치
        const finalGiftValue = giftCurrentValue * Math.pow(1 + inflation, years);

        // 결과창 UI 전환
        document.getElementById('placeholderMsg').style.display = 'none';

        const resultContent = document.getElementById('resultContent');
        resultContent.classList.remove('is-visible');
        resultContent.style.display = 'flex';
        void resultContent.offsetWidth; // reflow to re-trigger animation
        resultContent.classList.add('is-visible');

        // 모바일 최적화: 결과 영역으로 자동 스크롤
        if (window.innerWidth <= 800) {
            setTimeout(() => {
                resultContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }

        // Achievement badge
        const badge = document.getElementById('achievementBadge');
        if (finalFutureValue >= finalGiftValue) {
            badge.textContent = '✅ 목표 달성';
            badge.className = 'achievement-badge success';
        } else {
            badge.textContent = '⚠️ 조금 부족해요';
            badge.className = 'achievement-badge fail';
        }

        document.getElementById('resTargetAgeText').innerText = targetAge;
        document.getElementById('resFuture').innerText = Math.round(finalFutureValue).toLocaleString() + "원";
        document.getElementById('resFutureApprox').innerText = formatApproximateCurrency(Math.round(finalFutureValue));
        document.getElementById('resGoal').innerText = Math.round(finalGiftValue).toLocaleString() + "원";
        document.getElementById('resGoalApprox').innerText = formatApproximateCurrency(Math.round(finalGiftValue));

        let seedText = hasSeed ? `기존에 준비한 씨드머니 <b>${Math.round(seedAmount/10000).toLocaleString()}만 원</b>이 함께 운용되어 좋은 결과를 냈습니다. ` : ``;

        let resultMsg = "";
        if (finalFutureValue >= finalGiftValue) {
            resultMsg = `<span class="success-msg">✅ 목표 달성! ${targetAge}살에 목표 자금을 준비할 수 있습니다.</span><br>${seedText}'${giftName}'의 미래 가격보다 <b>${Math.round(finalFutureValue - finalGiftValue).toLocaleString()}원</b>의 여유가 있습니다. 지금처럼 꾸준히 이어가면 우리 아이에게 큰 선물을 전할 수 있어요. 👍`;
        } else {
            resultMsg = `<span class="fail-msg">📊 목표까지 조금 더 필요해요.</span><br>${seedText}'${giftName}'의 미래 가격까지 <b>${Math.round(finalGiftValue - finalFutureValue).toLocaleString()}원</b>이 부족합니다. 월 납입금을 조금 늘리거나 투자 기간을 연장하면 목표를 달성할 수 있습니다.`;
        }

        const text = `💌 <b>아빠의 편지:</b><br>우리가 함께 고른 큰 선물 <b>${giftName}</b>은 현재 ${Math.round(giftCurrentValue/10000).toLocaleString()}만 원이지만, ${targetAge}살이 되는 ${years}년 후에는 물가 상승으로 <b>${Math.round(finalGiftValue).toLocaleString()}원</b>이 될 것으로 예상됩니다.<br><br>${resultMsg}`;
        
        document.getElementById('resText').innerHTML = text;

        // --- 증여세 마일스톤 타임라인 ---
        let firstReportAge = hasSeed ? seedAge : currentAge;

        // 총 비과세 가능 금액 계산
        let totalTaxFree = 0;
        let calcAge = firstReportAge;
        while (calcAge <= targetAge) {
            totalTaxFree += calcAge >= 19 ? 50000000 : 20000000;
            calcAge += 10;
        }

        let milestonesHtml = '';
        let currentReportAge = firstReportAge;
        let cycleIndex = 0;

        while (currentReportAge <= targetAge) {
            const isFirstCycle = cycleIndex === 0;
            const limitAmountNum = currentReportAge >= 19 ? 50000000 : 20000000;
            const limitAmountTxt = currentReportAge >= 19 ? '5,000만 원' : '2,000만 원';
            const personStatus = currentReportAge >= 19 ? '성인' : '미성년자';
            const cycleEndAge = currentReportAge + 9;

            // 상태 결정
            let stateClass, statusBadge;
            if (cycleEndAge < currentAge) {
                stateClass = 'is-done';   statusBadge = '✅ 완료';
            } else if (currentReportAge <= currentAge) {
                stateClass = 'is-active'; statusBadge = '🔥 진행 중';
            } else {
                stateClass = 'is-future'; statusBadge = '📅 예정';
            }

            // 한도 정보 (칩 형태)
            const limitChip = `<span class="milestone-limit-chip">${limitAmountTxt} 한도</span>`;

            // 상세 정보 (씨드머니 첫 사이클 / 진행중)
            let detailHtml = '';
            if (isFirstCycle && hasSeed) {
                const remaining = Math.max(0, limitAmountNum - seedAmount);
                detailHtml = `<div class="milestone-detail"><div class="milestone-used">신고 완료: ${Math.round(seedAmount / 10000).toLocaleString()}만 원 / ${limitChip}</div>`;
                if (remaining > 0 && stateClass === 'is-active') {
                    detailHtml += `<div style="margin-top:5px;"><span class="milestone-remaining">${Math.round(remaining / 10000).toLocaleString()}만 원 추가 가능</span><br><span class="milestone-action">↳ ${cycleEndAge}세 전까지 추가 신고하세요!</span></div>`;
                } else if (remaining > 0 && stateClass === 'is-done') {
                    detailHtml += `<div class="milestone-expired">↳ 남은 한도 ${Math.round(remaining / 10000).toLocaleString()}만 원은 ${cycleEndAge}세 이후 소멸</div>`;
                }
                detailHtml += `</div>`;
            } else if (stateClass === 'is-active') {
                detailHtml = `<div class="milestone-detail"><span class="milestone-action">지금 신고 가능! 세금 없이 드릴 수 있어요 🎁</span></div>`;
            } else {
                // 미래/과거 일반 사이클일 때 한도 표시
                detailHtml = `<div class="milestone-detail"><div class="milestone-used">${personStatus} · ${limitChip}</div></div>`;
            }

            // 유기정기금 비과세 최대 월납입액 계산 (완료 사이클 제외, 월납입금 있을 때만)
            let annuityHtml = '';
            if (stateClass !== 'is-done' && monthly > 0) {
                const cycleStart = stateClass === 'is-active' ? currentAge : currentReportAge;
                const cycleEnd = Math.min(cycleEndAge, targetAge);
                const n = cycleEnd - cycleStart + 1;  // 10세~19세 = 10년 (양 끝 포함)
                if (n > 0) {
                    // 연차별 할인합산 방식 (유기정기금 평가명세 공식): Σ_{k=0}^{n-1} (1/1.03)^k
                    const r = 1 / 1.03;
                    const pvSum = (1 - Math.pow(r, n)) / (1 - r);
                    // 과세미달 기준 포함: 비과세 한도 초과분이 50만원 이하이면 실세금 없음
                    const effectiveLimit = limitAmountNum + 500000;
                    const maxMonthly = Math.floor(effectiveLimit / (12 * pvSum) / 1000) * 1000;
                    const man = Math.floor(maxMonthly / 10000);
                    const cheon = Math.floor((maxMonthly % 10000) / 1000);
                    const maxMonthlyTxt = cheon > 0 ? `${man}만 ${cheon}천 원` : `${man}만 원`;
                    
                    const overLimitHtml = monthly > maxMonthly ? `
                            <div class="annuity-overlimit">⚠️ 월 ${Math.round(monthly / 10000)}만 원 납입 시 한도 초과 가능성</div>` : '';
                    
                    // 간소화된 UI: 타이틀과 설명 제거하고 핵심 수치만 강조
                    annuityHtml = `
                        <div class="milestone-annuity">
                            <div class="milestone-annuity-row">
                                <span>비과세 월 납입 한도</span>
                                <span class="annuity-max">${maxMonthlyTxt}</span>
                            </div>
                            ${overLimitHtml}
                        </div>`;
                }
            }

            milestonesHtml += `
                <div class="milestone-item ${stateClass}">
                    <div class="milestone-dot"></div>
                    <div class="milestone-card">
                        <div class="milestone-header">
                            <span class="milestone-status">${statusBadge}</span>
                            <span class="milestone-ages">${currentReportAge}세 ~ ${cycleEndAge}세</span>
                        </div>
                        ${detailHtml}
                        ${annuityHtml}
                    </div>
                </div>`;

            currentReportAge += 10;
            cycleIndex++;
        }

        const scheduleHtml = `
            <div class="tax-milestone-wrap">
                <div class="tax-summary-banner">
                    <h4>💡 알아두면 좋은 증여세 절세 가이드</h4>
                    <div class="tax-summary-total">총 ${Math.round(totalTaxFree / 10000).toLocaleString()}만 원 + α</div>
                    <div class="tax-summary-sub">10년 주기 비과세 갱신 · 적립식 증여 시 연 3% 할인 혜택 적용</div>
                </div>
                <div class="milestone-timeline">${milestonesHtml}</div>
            </div>`;
        document.getElementById('taxTipBox').innerHTML = scheduleHtml;

        // 차트 그리기
        const labels = [];
        const dataFuture = [];
        const dataGoal = [];
        const dataSavings = [];

        const savingsMonthlyRate = 0.03 / 12; // 예적금 고정 연 3%

        for (let i = 1; i <= years; i++) {
            labels.push((currentAge + i) + '세');
            let m = i * 12;

            let currentFvSeed = seedAmount * Math.pow(1 + monthlyRate, m);
            let currentFvMonthly = monthlyRate === 0 ? monthly * m : monthly * ((Math.pow(1 + monthlyRate, m) - 1) / monthlyRate);
            let totalFv = currentFvSeed + currentFvMonthly;

            let gv = giftCurrentValue * Math.pow(1 + inflation, i);

            // 예적금 (연 3% 고정) - 씨드머니 거치식 + 매월 납입 적립식
            let svSeed = seedAmount * Math.pow(1 + savingsMonthlyRate, m);
            let svMonthly = monthly * ((Math.pow(1 + savingsMonthlyRate, m) - 1) / savingsMonthlyRate);
            let totalSv = svSeed + svMonthly;

            dataFuture.push(Math.round(totalFv));
            dataGoal.push(Math.round(gv));
            dataSavings.push(Math.round(totalSv));
        }

        const ctx = document.getElementById('growthChart').getContext('2d');
        if (myChart !== null) { myChart.destroy(); }

        const isMobile = window.innerWidth <= 600;
        const chartDataDisplay = document.getElementById('chartDataDisplay');

        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: '아빠의 운용 자금',
                        data: dataFuture,
                        borderColor: '#FF9500',
                        backgroundColor: 'rgba(255, 149, 0, 0.08)',
                        borderWidth: 3,
                        pointBackgroundColor: '#FF9500',
                        pointRadius: 0,
                        pointHoverRadius: 6,
                        pointHoverBorderColor: '#fff',
                        pointHoverBorderWidth: 2,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: '일반 예적금 (3%)',
                        data: dataSavings,
                        borderColor: '#4299E1',
                        backgroundColor: 'rgba(66, 153, 225, 0.05)',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        pointRadius: 0,
                        pointHoverRadius: 5,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: '선물 미래 가격',
                        data: dataGoal,
                        borderColor: '#D63939',
                        borderWidth: 2,
                        borderDash: [3, 3],
                        pointRadius: 0,
                        pointHoverRadius: 5,
                        fill: false,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 10,
                        bottom: isMobile ? 10 : 0
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { 
                            color: '#868E96', 
                            font: { size: isMobile ? 10 : 11 },
                            maxRotation: 0,
                            autoSkip: true,
                            maxTicksLimit: isMobile ? 6 : 10
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(0, 0, 0, 0.04)', drawBorder: false },
                        ticks: {
                            color: '#868E96',
                            font: { size: isMobile ? 10 : 11 },
                            callback: function(value) {
                                if (value >= 100000000) return (value / 100000000).toFixed(1) + '억';
                                if (value >= 10000) return (value / 10000).toLocaleString() + '만';
                                return value.toLocaleString();
                            }
                        }
                    }
                },
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    legend: {
                        position: isMobile ? 'bottom' : 'top',
                        align: isMobile ? 'center' : 'end',
                        labels: {
                            boxWidth: 8,
                            boxHeight: 8,
                            usePointStyle: true,
                            padding: isMobile ? 15 : 20,
                            color: '#444444',
                            font: { size: isMobile ? 11 : 12, weight: '600' }
                        }
                    },
                    tooltip: {
                        enabled: false, // 기존 툴팁 비활성화
                        external: function(context) {
                            // 툴팁 데이터 추출
                            const tooltipModel = context.tooltip;
                            if (tooltipModel.opacity === 0) {
                                // 호버가 끝나도 마지막 데이터를 유지하거나 초기 상태로 되돌릴 수 있음
                                return;
                            }

                            if (tooltipModel.body) {
                                const title = tooltipModel.title[0] || '';
                                const bodyLines = tooltipModel.body.map(b => b.lines);
                                
                                let html = `
                                    <div class="display-header">
                                        <span class="display-age">👶 ${title}</span>
                                    </div>
                                    <div class="display-body">
                                `;

                                tooltipModel.dataPoints.forEach(function(point) {
                                    const label = point.dataset.label;
                                    const val = point.raw;
                                    let formattedVal = "";
                                    
                                    if (val >= 100000000) {
                                        const eok = Math.floor(val / 100000000);
                                        const man = Math.round((val % 100000000) / 10000);
                                        formattedVal = (eok > 0 ? `${eok}억 ` : '') + (man > 0 ? `${man}만` : '') + '원';
                                    } else {
                                        formattedVal = Math.round(val / 10000).toLocaleString() + '만 원';
                                    }

                                    const isHighlight = label === '아빠의 운용 자금';
                                    html += `
                                        <div class="display-row">
                                            <span class="display-label">${label}</span>
                                            <span class="display-value ${isHighlight ? 'highlight' : ''}">${formattedVal}</span>
                                        </div>
                                    `;
                                });

                                html += '</div>';
                                chartDataDisplay.innerHTML = html;
                            }
                        }
                    }
                }
            }
        });
    }
});