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
        document.getElementById('resultContent').style.display = 'flex';

        document.getElementById('resTargetAgeText').innerText = targetAge;
        document.getElementById('resFuture').innerText = Math.round(finalFutureValue).toLocaleString() + "원";
        document.getElementById('resFutureApprox').innerText = formatApproximateCurrency(Math.round(finalFutureValue));
        document.getElementById('resGoal').innerText = Math.round(finalGiftValue).toLocaleString() + "원";
        document.getElementById('resGoalApprox').innerText = formatApproximateCurrency(Math.round(finalGiftValue));

        let seedText = hasSeed ? `아빠가 미리 신고해둔 <b>${Math.round(seedAmount/10000).toLocaleString()}만 원</b>이 같이 굴러가서 힘을 꽤 썼어! ` : ``;

        let resultMsg = "";
        if (finalFutureValue >= finalGiftValue) {
            resultMsg = `<span class="success-msg">🎉 경축! 네가 ${targetAge}살이 되는 해, 우리는 목표를 달성했다!</span><br>${seedText}네가 받고 싶어 할 '${giftName}'의 미래 가격보다 무려 <b>${Math.round(finalFutureValue - finalGiftValue).toLocaleString()}원</b>이나 여유가 있구나. 아빠가 해주고 싶은 선물 확실히 챙겨줄 테니, 약속대로 ${targetAge}살엔 쿨하게 독립하는 거다? 😎`;
        } else {
            resultMsg = `<span class="fail-msg">😭 아차... 물가의 벽이 높구나...</span><br>${seedText}아무리 열심히 굴려도 '${giftName}'을 온전히 사주기엔 <b>${Math.round(finalGiftValue - finalFutureValue).toLocaleString()}원</b>이 모자라네. 네가 ${targetAge}살이 되기 전에 아빠가 투자금을 늘리든지, 아니면 선물을 조금 타협해야 할지도 모르겠다. 🤦‍♂️`;
        }

        const text = `💌 <b>아빠의 팩트 폭격 편지:</b><br>네가 고른 <b>${giftName}</b>, 지금은 ${Math.round(giftCurrentValue/10000).toLocaleString()}만 원이지만 네가 ${targetAge}살이 되는 ${years}년 뒤엔 물가가 올라서 무려 <b>${Math.round(finalGiftValue).toLocaleString()}원</b>이 된단다.<br><br>${resultMsg}`;
        
        document.getElementById('resText').innerHTML = text;

        // --- 증여세 스케줄 로직 고도화 ---
        let firstReportAge = hasSeed ? seedAge : currentAge;
        let scheduleHtml = `
            <div class="tax-tip">
                <h4>💡 아빠를 위한 절세 꿀팁: 우리 아이 증여세 비과세 마일스톤</h4>
                <p style="margin-top:0; margin-bottom:12px; font-size: 0.9em; color: #5f6368;">
                    증여세 비과세 한도는 <b>10년마다 갱신</b>됩니다.<br>
                    (미성년자 2천만 원, 성인 5천만 원) 기간 내에는 남은 한도만큼 세금 없이 더 줄 수 있습니다!
                </p>
                <ul style="line-height: 1.8;">
        `;

        let currentReportAge = firstReportAge;
        let isFirstCycle = true;

        while(currentReportAge <= targetAge) {
            let limitAmountNum = currentReportAge >= 19 ? 50000000 : 20000000;
            let limitAmountTxt = currentReportAge >= 19 ? "5,000만 원" : "2,000만 원";
            let personStatus = currentReportAge >= 19 ? "성인" : "미성년자";
            let cycleEndAge = currentReportAge + 9;
            
            let isPast = currentReportAge < currentAge;

            if (isFirstCycle && hasSeed) {
                let remaining = Math.max(0, limitAmountNum - seedAmount);
                scheduleHtml += `<li style="color:#9aa0a6;"><del style='color:#bdc3c7;'><b>${currentReportAge}세</b> : 최초 신고 완료 (${Math.round(seedAmount/10000).toLocaleString()}만 원)</del></li>`;
                
                if (remaining > 0 && currentAge <= cycleEndAge) {
                    scheduleHtml += `<li style="list-style-type: none; padding-left: 15px; margin-top: -5px; margin-bottom: 10px;">
                        <span style="color:#d35400; font-weight:bold;">↳ 🚨 아직 한도가 남았어요! ${cycleEndAge}세까지 <span style="background-color:#ffecb3; padding:2px 6px; border-radius:4px; color:#b94a00;">${Math.round(remaining/10000).toLocaleString()}만 원</span> 추가 비과세 가능!</span>
                    </li>`;
                } else if (remaining > 0 && currentAge > cycleEndAge) {
                    scheduleHtml += `<li style="list-style-type: none; padding-left: 15px; margin-top: -5px; margin-bottom: 10px;">
                        <span style="font-size:0.85em; color:#bdc3c7;">↳ <del>(남은 한도 ${Math.round(remaining/10000).toLocaleString()}만 원은 ${cycleEndAge}세가 지나 소멸되었습니다)</del></span>
                    </li>`;
                }
            } else {
                let timeLabel = isPast ? "(이미 지남)" : (currentReportAge === currentAge ? "(지금 당장!)" : "(예정)");
                let boldStart = isPast ? "<del style='color:#bdc3c7;'>" : "<b>";
                let boldEnd = isPast ? "</del>" : "</b>";
                let textColor = isPast ? "color:#9aa0a6;" : "color:#202124;";

                scheduleHtml += `<li style="${textColor}">${boldStart}${currentReportAge}세 ${timeLabel} : ${limitAmountTxt} 비과세 한도 갱신 (${personStatus})${boldEnd}</li>`;
            }
            
            currentReportAge += 10;
            isFirstCycle = false;
        }
        scheduleHtml += `</ul></div>`;
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

        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: '아빠의 펀드 자금',
                        data: dataFuture,
                        borderColor: '#FF9F0A',
                        backgroundColor: 'rgba(255, 159, 10, 0.10)',
                        borderWidth: 2.5,
                        pointBackgroundColor: '#FF9F0A',
                        pointRadius: 0,
                        pointHoverRadius: 5,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: '일반 예적금 (연 3%)',
                        data: dataSavings,
                        borderColor: '#5A8FD6',
                        backgroundColor: 'rgba(90, 143, 214, 0.06)',
                        borderWidth: 2,
                        borderDash: [4, 3],
                        pointRadius: 0,
                        pointHoverRadius: 5,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: `${giftName} 예상 가격`,
                        data: dataGoal,
                        borderColor: '#FF453A',
                        borderWidth: 2,
                        borderDash: [5, 4],
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
                scales: {
                    x: {
                        grid: { color: 'rgba(60, 60, 67, 0.08)' },
                        ticks: { color: '#8E8E93', font: { size: 11 } }
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(60, 60, 67, 0.08)' },
                        ticks: {
                            color: '#8E8E93',
                            font: { size: 11 },
                            callback: function(value) {
                                return (value / 100000000).toFixed(1) + '억';
                            }
                        }
                    }
                },
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    legend: {
                        labels: {
                            color: '#3C3C43',
                            font: { size: 12, weight: '600' },
                            usePointStyle: true,
                            pointStyleWidth: 10
                        }
                    },
                    tooltip: {
                        backgroundColor: '#FFFFFF',
                        titleColor: '#8E8E93',
                        bodyColor: '#1C1C1E',
                        borderColor: 'rgba(60, 60, 67, 0.15)',
                        borderWidth: 1,
                        padding: 12,
                        callbacks: {
                            title: function(context) { return `아이가 ${context[0].label} 때`; },
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) { label += ': '; }
                                if (context.parsed.y !== null) {
                                    label += Math.round(context.parsed.y / 10000).toLocaleString() + '만 원';
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }
});