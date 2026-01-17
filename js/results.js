// Results Page
class ResultsPage {
    constructor() {
        this.result = null;
        this.chart = null;
        
        this.init();
    }
    
    init() {
        // Lấy ID từ URL
        const urlParams = new URLSearchParams(window.location.search);
        const resultId = urlParams.get('id');
        
        if (resultId) {
            this.loadResult(resultId);
        } else {
            // Nếu không có ID, lấy kết quả gần nhất
            this.loadLatestResult();
        }
    }
    
    loadResult(resultId) {
        const results = Storage.getResults();
        this.result = results.find(r => r.id == resultId);
        
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
        // Cập nhật ngày
        const dateElement = document.getElementById('resultDate');
        if (dateElement) {
            dateElement.textContent = `Kết quả ngày ${this.result.date || 'Không xác định'}`;
        }
        
        // Hiển thị phong cách chính
        this.displayDominantStyles();
        
        // Hiển thị điểm số chi tiết
        this.displayDetailedScores();
        
        // Tạo biểu đồ
        this.createChart();
        
        // Hiển thị lời khuyên
        this.displayAdvice();
    }
    
    displayDominantStyles() {
        const container = document.getElementById('dominantContainer');
        const description = document.getElementById('dominantDescription');
        
        if (!container || !description) return;
        
        // Xóa nội dung cũ
        container.innerHTML = '';
        description.innerHTML = '';
        
        // Thêm badge cho mỗi phong cách chính
        this.result.dominant.forEach(style => {
            const badge = document.createElement('span');
            badge.className = `style-badge badge-${style}`;
            badge.textContent = this.getStyleFullName(style);
            container.appendChild(badge);
        });
        
        // Thêm mô tả
        if (this.result.dominant.length === 1) {
            description.innerHTML = `
                <p>Bạn có xu hướng học tập chủ yếu qua <strong>${this.getStyleFullName(this.result.dominant[0])}</strong>.</p>
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
        
        // Tìm điểm cao nhất để tính phần trăm
        const maxScore = Math.max(...Object.values(this.result.scores));
        
        // Tạo HTML cho từng loại điểm
        let html = '';
        const styles = ['V', 'A', 'R', 'K'];
        
        styles.forEach(style => {
            const score = this.result.scores[style] || 0;
            const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
            
            html += `
                <div class="score-item">
                    <div class="score-label">
                        <strong>${this.getStyleFullName(style)}</strong>
                    </div>
                    
                    <div class="score-bar-container">
                        <div class="score-bar bar-${style}" style="width: ${percentage}%"></div>
                    </div>
                    
                    <div class="score-value">
                        <strong>${score}</strong> điểm
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }
    
    createChart() {
        const ctx = document.getElementById('varkChart');
        if (!ctx) return;
        
        // Nếu đã có biểu đồ cũ, hủy nó
        if (this.chart) {
            this.chart.destroy();
        }
        
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
                        max: Math.max(...Object.values(this.result.scores)) + 1,
                        ticks: {
                            stepSize: 1
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
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
        
        // Hiển thị lời khuyên cho phong cách chính trước
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
        
        // Hiển thị lời khuyên cho các phong cách khác
        const allStyles = ['V', 'A', 'R', 'K'];
        allStyles.forEach(style => {
            if (!this.result.dominant.includes(style) && advice[style]) {
                html += `
                    <div class="advice-card">
                        <h4>${advice[style].title}</h4>
                        <p>Bạn có thể kết hợp: ${advice[style].tips.slice(0, 3).join(', ')}...</p>
                    </div>
                `;
            }
        });
        
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
    
    showError() {
        const container = document.querySelector('.results-container');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <h2><i class="fas fa-exclamation-triangle"></i> Không tìm thấy kết quả</h2>
                    <p>Không thể tìm thấy kết quả với ID đã cho.</p>
                    <a href="index.html" class="btn-primary">Về trang chủ</a>
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
                </div>
            `;
        }
    }
}

// Khởi tạo trang kết quả
document.addEventListener('DOMContentLoaded', () => {
    new ResultsPage();
});