// js/results.js
class ResultsPage {
    constructor() {
        this.result = null;
        this.chart = null;
        
        this.init();
    }
    
    init() {
        const urlParams = new URLSearchParams(window.location.search);
        const resultId = urlParams.get('id');
        
        if (resultId) {
            this.loadResult(resultId);
        } else {
            this.loadLatestResult();
        }
        
        this.setupEventListeners();
    }
    
    loadResult(resultId) {
        this.result = Storage.getResultById(resultId);
        
        if (this.result) {
            this.displayResult();
        } else {
            this.showError();
        }
    }
    
    loadLatestResult() {
        this.result = Storage.getLatestResult();
        
        if (this.result) {
            this.displayResult();
        } else {
            this.showNoResult();
        }
    }
    
    displayResult() {
        const dateElement = document.getElementById('resultDate');
        if (dateElement) {
            dateElement.textContent = `Kết quả ngày ${this.result.date || 'Không xác định'}`;
        }
        
        this.displayResultSummary();
        this.displayDominantStyles();
        this.displayDetailedScores();
        this.createChart();
        this.displayAdvice();
        this.displayAnswerDetails(); // Mới: hiển thị đáp án chi tiết
    }
    
    displayResultSummary() {
        const totalQuestions = this.result.totalQuestions || 16;
        const answered = this.result.answeredCount || Object.keys(this.result.answers || {}).length;
        const percentage = Math.round((answered / totalQuestions) * 100);
        
        const summaryElement = document.getElementById('resultSummary');
        if (summaryElement) {
            summaryElement.innerHTML = `
                <p>Đã hoàn thành: <strong>${answered}/${totalQuestions}</strong> câu (${percentage}%)</p>
                <p>Thời gian: ${new Date(this.result.timestamp).toLocaleString('vi-VN')}</p>
            `;
        }
    }
    
    displayDominantStyles() {
        const container = document.getElementById('dominantContainer');
        const description = document.getElementById('dominantDescription');
        
        if (!container || !description) return;
        
        container.innerHTML = '';
        description.innerHTML = '';
        
        this.result.dominant.forEach(style => {
            const badge = document.createElement('span');
            badge.className = `style-badge badge-${style}`;
            badge.textContent = this.getStyleFullName(style);
            container.appendChild(badge);
        });
        
        if (this.result.dominant.length === 1) {
            description.innerHTML = `
                <p>Bạn là người học chủ yếu qua phong cách <strong>${this.getStyleFullName(this.result.dominant[0])}</strong>.</p>
                <p>Điều này có nghĩa bạn tiếp thu kiến thức tốt nhất qua phương pháp phù hợp với phong cách này.</p>
            `;
        } else {
            description.innerHTML = `
                <p>Bạn có đa phong cách học tập: <strong>${this.result.dominant.map(s => this.getStyleFullName(s)).join(', ')}</strong>.</p>
                <p>Đây là một lợi thế! Bạn có thể linh hoạt kết hợp nhiều phương pháp học khác nhau.</p>
            `;
        }
    }
    
    displayDetailedScores() {
        const container = document.getElementById('scoresDetail');
        if (!container) return;
        
        const totalQuestions = this.result.totalQuestions || 16;
        let html = '';
        const styles = ['V', 'A', 'R', 'K'];
        
        styles.forEach(style => {
            const score = this.result.scores[style] || 0;
            const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
            
            html += `
                <div class="score-item">
                    <div class="score-label">
                        <strong>${this.getStyleFullName(style)}</strong>
                    </div>
                    
                    <div class="score-bar-container">
                        <div class="score-bar bar-${style}" style="width: ${percentage}%"></div>
                    </div>
                    
                    <div class="score-value">
                        <strong>${score}/${totalQuestions}</strong> (${percentage}%)
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }
    
    createChart() {
        const ctx = document.getElementById('varkChart');
        if (!ctx) return;
        
        if (this.chart) {
            this.chart.destroy();
        }
        
        const totalQuestions = this.result.totalQuestions || 16;
        const data = {
            labels: ['Visual', 'Aural', 'Read/Write', 'Kinesthetic'],
            datasets: [{
                label: 'Điểm số',
                data: [
                    this.result.scores.V || 0,
                    this.result.scores.A || 0,
                    this.result.scores.R || 0,
                    this.result.scores.K || 0
                ],
                backgroundColor: [
                    'rgba(52, 152, 219, 0.5)',
                    'rgba(155, 89, 182, 0.5)',
                    'rgba(231, 76, 60, 0.5)',
                    'rgba(46, 204, 113, 0.5)'
                ],
                borderColor: [
                    'rgb(52, 152, 219)',
                    'rgb(155, 89, 182)',
                    'rgb(231, 76, 60)',
                    'rgb(46, 204, 113)'
                ],
                borderWidth: 2
            }]
        };
        
        const config = {
            type: 'radar',
            data: data,
            options: {
                scales: {
                    r: {
                        beginAtZero: true,
                        max: totalQuestions,
                        ticks: {
                            stepSize: Math.max(2, Math.ceil(totalQuestions / 8))
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.raw}`;
                            }
                        }
                    }
                }
            }
        };
        
        this.chart = new Chart(ctx, config);
    }
    
    displayAdvice() {
        const container = document.getElementById('adviceContainer');
        if (!container) return;
        
        const advice = {
            'V': {
                title: 'Cho người học qua Hình ảnh (Visual)',
                tips: [
                    'Sử dụng sơ đồ tư duy (mindmap) để ghi chép',
                    'Dùng bút highlight nhiều màu để đánh dấu thông tin quan trọng',
                    'Xem video giảng dạy, hình ảnh minh họa',
                    'Tạo flashcards với hình ảnh',
                    'Sử dụng biểu đồ, đồ thị để hiểu dữ liệu'
                ]
            },
            'A': {
                title: 'Cho người học qua Thính giác (Aural)',
                tips: [
                    'Ghi âm bài giảng và nghe lại',
                    'Thảo luận nhóm với bạn bè',
                    'Đọc to tài liệu khi học',
                    'Sử dụng ứng dụng chuyển văn bản thành giọng nói',
                    'Giảng giải lại kiến thức cho người khác'
                ]
            },
            'R': {
                title: 'Cho người học qua Đọc/Viết (Read/Write)',
                tips: [
                    'Ghi chép đầy đủ và hệ thống',
                    'Viết tóm tắt sau mỗi bài học',
                    'Đọc nhiều tài liệu tham khảo',
                    'Làm đề cương chi tiết',
                    'Viết lại công thức, định nghĩa nhiều lần'
                ]
            },
            'K': {
                title: 'Cho người học qua Vận động (Kinesthetic)',
                tips: [
                    'Kết hợp học với vận động nhẹ (đi lại, vẽ)',
                    'Thực hành ngay sau khi học lý thuyết',
                    'Sử dụng mô hình, vật thật để học',
                    'Tham gia thí nghiệm, thực địa',
                    'Học thông qua trò chơi, hoạt động thực tế'
                ]
            }
        };
        
        let html = '';
        
        // Hiển thị chi tiết cho phong cách chính
        this.result.dominant.forEach(style => {
            if (advice[style]) {
                html += `
                    <div class="advice-card advice-${style}">
                        <h4><i class="fas fa-star"></i> ${advice[style].title}</h4>
                        <ul>
                            ${advice[style].tips.map(tip => `<li>${tip}</li>`).join('')}
                        </ul>
                    </div>
                `;
            }
        });
        
        // Gợi ý cho các phong cách khác
        const allStyles = ['V', 'A', 'R', 'K'];
        const otherStyles = allStyles.filter(style => !this.result.dominant.includes(style));
        
        if (otherStyles.length > 0) {
            html += `<div class="advice-section">
                <h4><i class="fas fa-lightbulb"></i> Gợi ý kết hợp thêm</h4>
                <p>Bạn cũng có thể thử:</p>`;
            
            otherStyles.forEach(style => {
                if (advice[style]) {
                    html += `
                        <div class="advice-tip">
                            <strong>${this.getStyleFullName(style)}:</strong>
                            ${advice[style].tips.slice(0, 2).join(', ')}
                        </div>
                    `;
                }
            });
            
            html += `</div>`;
        }
        
        container.innerHTML = html;
    }
    
    // MỚI: Hiển thị chi tiết đáp án đã chọn
    displayAnswerDetails() {
        const container = document.getElementById('answerDetails');
        if (!container || !this.result.answers || !this.result.varkMapping) return;
        
        const totalQuestions = this.result.totalQuestions || 16;
        let html = '<h4><i class="fas fa-list-check"></i> Chi tiết đáp án</h4>';
        
        for (let i = 1; i <= totalQuestions; i++) {
            const answer = this.result.answers[i];
            if (!answer) continue;
            
            const varkType = this.result.varkMapping[i]?.[answer] || '?';
            const letter = answer;
            const varkName = this.getStyleFullName(varkType);
            
            html += `
                <div class="answer-detail">
                    <span class="answer-q">Câu ${i}:</span>
                    <span class="answer-letter">${letter}</span>
                    <span class="answer-vark">→ ${varkName}</span>
                </div>
            `;
        }
        
        container.innerHTML = html;
    }
    
    getStyleFullName(code) {
        const styles = {
            'V': 'Visual (Hình ảnh)',
            'A': 'Aural (Thính giác)',
            'R': 'Read/Write (Đọc/Viết)',
            'K': 'Kinesthetic (Vận động)'
        };
        return styles[code] || code;
    }
    
    setupEventListeners() {
        // Nút chia sẻ
        const shareBtn = document.getElementById('shareBtn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.shareResult());
        }
        
        // Nút làm lại
        const retakeBtn = document.getElementById('retakeBtn');
        if (retakeBtn) {
            retakeBtn.addEventListener('click', () => {
                window.location.href = 'quiz.html';
            });
        }
        
        // Nút xem lịch sử
        const historyBtn = document.getElementById('historyBtn');
        if (historyBtn) {
            historyBtn.addEventListener('click', () => {
                window.location.href = 'history.html';
            });
        }
    }
    
    shareResult() {
        let shareText = `Kết quả trắc nghiệm VARK của tôi:\n`;
        
        this.result.dominant.forEach(style => {
            shareText += `🏆 ${this.getStyleFullName(style)}\n`;
        });
        
        shareText += `\nTìm hiểu phong cách học tập của bạn tại: ${window.location.origin}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Kết quả trắc nghiệm VARK',
                text: shareText,
                url: window.location.href
            });
        } else if (navigator.clipboard) {
            navigator.clipboard.writeText(shareText).then(() => {
                alert('Đã sao chép kết quả vào clipboard!');
            });
        } else {
            prompt('Sao chép kết quả:', shareText);
        }
    }
    
    showError() {
        const container = document.querySelector('.results-container');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <h2><i class="fas fa-exclamation-triangle"></i> Không tìm thấy kết quả</h2>
                    <p>Không thể tìm thấy kết quả với ID đã cho.</p>
                    <a href="index.html" class="btn-primary">Về trang chủ</a>
                    <a href="quiz.html" class="btn-secondary">Làm trắc nghiệm</a>
                </div>
            `;
        }
    }
    
    showNoResult() {
        const container = document.querySelector('.results-container');
        if (container) {
            container.innerHTML = `
                <div class="no-result-message">
                    <h2><i class="fas fa-clipboard-list"></i> Chưa có kết quả nào</h2>
                    <p>Bạn chưa hoàn thành bài trắc nghiệm nào.</p>
                    <a href="quiz.html" class="btn-primary">Làm trắc nghiệm ngay</a>
                    <a href="index.html" class="btn-secondary">Về trang chủ</a>
                </div>
            `;
        }
    }
}

// Khởi tạo khi trang tải xong
document.addEventListener('DOMContentLoaded', () => {
    // Kiểm tra xem Chart.js đã được tải chưa
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js chưa được tải. Vui lòng thêm thẻ script trong HTML.');
    }
    
    new ResultsPage();
});