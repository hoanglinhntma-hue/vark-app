// js/history.js
class HistoryPage {
    constructor() {
        this.results = [];
        this.init();
    }
    
    init() {
        this.loadHistory();
        this.setupEventListeners();
    }
    
    loadHistory() {
        this.results = Storage.getResults();
        this.displayHistory();
        this.updateCount();
    }
    
    displayHistory() {
        const list = document.getElementById('historyList');
        const clearSection = document.getElementById('clearAllSection');
        
        if (!list) return;
        
        if (this.results.length === 0) {
            list.innerHTML = `
                <div class="empty-history">
                    <i class="fas fa-clipboard-list fa-3x"></i>
                    <h3>Chưa có lịch sử nào</h3>
                    <p>Hãy làm trắc nghiệm đầu tiên để xem kết quả ở đây</p>
                    <a href="quiz.html" class="btn-primary">
                        <i class="fas fa-play-circle"></i> Làm trắc nghiệm ngay
                    </a>
                </div>
            `;
            if (clearSection) clearSection.style.display = 'none';
            return;
        }
        
        // Sắp xếp theo thời gian mới nhất trước (theo timestamp)
        this.results.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
        
        let html = '';
        this.results.forEach((result, index) => {
            const mainStyle = result.dominant && result.dominant.length > 0 ? result.dominant[0] : 'V';
            const date = result.date || 'Không xác định';
            const time = result.timestamp ? new Date(result.timestamp).toLocaleTimeString('vi-VN', { 
                hour: '2-digit', 
                minute: '2-digit' 
            }) : '';
            
            // Tính tổng điểm và phần trăm
            const totalQuestions = result.totalQuestions || 16;
            const answered = result.answeredCount || Object.keys(result.answers || {}).length;
            const percentage = totalQuestions > 0 ? Math.round((answered / totalQuestions) * 100) : 0;
            
            // Phong cách chính (hiển thị tên đầy đủ)
            let mainStyleText = 'Chưa xác định';
            if (result.dominant && result.dominant.length > 0) {
                const styles = result.dominant.map(s => this.getStyleFullName(s));
                mainStyleText = styles.length === 1 ? styles[0] : `Đa phong cách (${styles.join(', ')})`;
            }
            
            html += `
                <div class="history-item" data-style="${mainStyle}">
                    <div class="history-number">#${index + 1}</div>
                    
                    <div class="history-content">
                        <div class="history-header">
                            <h4>Kết quả ngày ${date} ${time ? ` - ${time}` : ''}</h4>
                            <span class="history-percentage">${percentage}% hoàn thành</span>
                        </div>
                        
                        <div class="history-details">
                            <div class="detail-item">
                                <i class="fas fa-star"></i>
                                <strong>Phong cách chính:</strong> ${mainStyleText}
                            </div>
                            
                            <div class="detail-item">
                                <i class="fas fa-chart-bar"></i>
                                <strong>Điểm:</strong> 
                                V:${result.scores?.V || 0} 
                                A:${result.scores?.A || 0} 
                                R:${result.scores?.R || 0} 
                                K:${result.scores?.K || 0}
                            </div>
                            
                            <div class="detail-item">
                                <i class="fas fa-question-circle"></i>
                                <strong>Số câu:</strong> ${answered}/${totalQuestions}
                            </div>
                            
                            ${result.answers ? `
                            <div class="detail-item">
                                <i class="fas fa-check-circle"></i>
                                <strong>Đáp án:</strong> 
                                ${this.getAnswerSummary(result.answers)}
                            </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    <div class="history-actions">
                        <a href="results.html?id=${result.id}" class="btn-action btn-view" title="Xem chi tiết">
                            <i class="fas fa-eye"></i> Xem
                        </a>
                        <button class="btn-action btn-delete" data-id="${result.id}" title="Xóa kết quả">
                            <i class="fas fa-trash"></i> Xóa
                        </button>
                        <button class="btn-action btn-share" onclick="shareResult('${result.id}')" title="Chia sẻ">
                            <i class="fas fa-share-alt"></i> Chia sẻ
                        </button>
                    </div>
                </div>
            `;
        });
        
        list.innerHTML = html;
        if (clearSection) clearSection.style.display = 'block';
        
        // Thêm sự kiện xóa
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                if (confirm('Bạn có chắc muốn xóa kết quả này?')) {
                    this.deleteResult(id);
                }
            });
        });
    }
    
    getAnswerSummary(answers) {
        if (!answers) return 'Không có dữ liệu';
        
        const count = {
            'A': 0, 'B': 0, 'C': 0, 'D': 0
        };
        
        Object.values(answers).forEach(answer => {
            if (count[answer] !== undefined) {
                count[answer]++;
            }
        });
        
        const total = Object.values(count).reduce((a, b) => a + b, 0);
        if (total === 0) return 'Chưa chọn đáp án';
        
        return `A:${count.A} B:${count.B} C:${count.C} D:${count.D}`;
    }
    
    updateCount() {
        const countElement = document.getElementById('historyCount');
        if (countElement) {
            const count = this.results.length;
            countElement.textContent = `Bạn đã làm trắc nghiệm ${count} lần`;
            
            // Cập nhật title
            const plural = count > 1 ? 'các kết quả' : 'kết quả';
            document.title = `Lịch sử VARK (${count} ${plural})`;
        }
    }
    
    deleteResult(id) {
        const success = Storage.deleteResult(id);
        if (success) {
            this.showMessage('Đã xóa kết quả thành công!', 'success');
            this.loadHistory();
        } else {
            this.showMessage('Không thể xóa kết quả. Vui lòng thử lại.', 'error');
        }
    }
    
    setupEventListeners() {
        const clearAllBtn = document.getElementById('clearAllBtn');
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', () => {
                if (this.results.length === 0) {
                    this.showMessage('Không có kết quả nào để xóa.', 'info');
                    return;
                }
                
                if (confirm(`Bạn có chắc muốn xóa TẤT CẢ ${this.results.length} kết quả? Hành động này không thể hoàn tác.`)) {
                    const success = Storage.clearAllResults();
                    if (success) {
                        this.showMessage('Đã xóa tất cả lịch sử!', 'success');
                        this.loadHistory();
                    } else {
                        this.showMessage('Không thể xóa lịch sử. Vui lòng thử lại.', 'error');
                    }
                }
            });
        }
        
        // Tìm kiếm (nếu có)
        const searchInput = document.getElementById('historySearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterHistory(e.target.value);
            });
        }
        
        // Lọc theo phong cách (nếu có)
        document.querySelectorAll('.style-filter').forEach(filter => {
            filter.addEventListener('click', (e) => {
                const style = e.currentTarget.dataset.style;
                this.filterByStyle(style);
            });
        });
    }
    
    filterHistory(searchTerm) {
        if (!searchTerm.trim()) {
            this.displayHistory();
            return;
        }
        
        const filtered = this.results.filter(result => {
            const searchLower = searchTerm.toLowerCase();
            
            // Tìm theo ngày
            if (result.date && result.date.toLowerCase().includes(searchLower)) {
                return true;
            }
            
            // Tìm theo phong cách
            if (result.dominant) {
                const styleNames = result.dominant.map(s => this.getStyleFullName(s).toLowerCase());
                if (styleNames.some(name => name.includes(searchLower))) {
                    return true;
                }
            }
            
            // Tìm theo ID
            if (result.id && result.id.toString().toLowerCase().includes(searchLower)) {
                return true;
            }
            
            return false;
        });
        
        this.displayFilteredResults(filtered);
    }
    
    filterByStyle(style) {
        if (!style || style === 'all') {
            this.displayHistory();
            return;
        }
        
        const filtered = this.results.filter(result => 
            result.dominant && result.dominant.includes(style)
        );
        
        this.displayFilteredResults(filtered);
    }
    
    displayFilteredResults(results) {
        const list = document.getElementById('historyList');
        if (!list) return;
        
        if (results.length === 0) {
            list.innerHTML = `
                <div class="empty-history">
                    <i class="fas fa-search fa-3x"></i>
                    <h3>Không tìm thấy kết quả phù hợp</h3>
                    <p>Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc</p>
                </div>
            `;
            return;
        }
        
        // Tạm thời hiển thị kết quả đã lọc
        const originalResults = this.results;
        this.results = results;
        this.displayHistory();
        this.results = originalResults;
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
    
    showMessage(message, type = 'info') {
        // Tạo hoặc cập nhật thông báo
        let messageDiv = document.getElementById('historyMessage');
        if (!messageDiv) {
            messageDiv = document.createElement('div');
            messageDiv.id = 'historyMessage';
            messageDiv.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 25px;
                border-radius: 8px;
                color: white;
                font-weight: bold;
                z-index: 1000;
                animation: slideIn 0.3s ease-out;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            `;
            document.body.appendChild(messageDiv);
        }
        
        const colors = {
            'success': '#2ecc71',
            'error': '#e74c3c',
            'info': '#3498db',
            'warning': '#f39c12'
        };
        
        messageDiv.style.backgroundColor = colors[type] || colors.info;
        messageDiv.textContent = message;
        messageDiv.style.display = 'block';
        
        // Tự động ẩn sau 3 giây
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 3000);
    }
}

// Hàm chia sẻ toàn cục
function shareResult(resultId) {
    const result = Storage.getResultById(resultId);
    if (!result) {
        alert('Không tìm thấy kết quả để chia sẻ');
        return;
    }
    
    let shareText = `Kết quả trắc nghiệm VARK của tôi:\n`;
    shareText += `📅 Ngày: ${result.date}\n`;
    
    if (result.dominant && result.dominant.length > 0) {
        const styleNames = result.dominant.map(s => {
            const names = {
                'V': 'Visual (Hình ảnh)',
                'A': 'Aural (Thính giác)',
                'R': 'Read/Write (Đọc/Viết)',
                'K': 'Kinesthetic (Vận động)'
            };
            return names[s] || s;
        });
        shareText += `🏆 Phong cách chính: ${styleNames.join(', ')}\n`;
    }
    
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
        prompt('Sao chép kết quả để chia sẻ:', shareText);
    }
}

// Khởi tạo khi trang tải xong
document.addEventListener('DOMContentLoaded', () => {
    new HistoryPage();
    
    // Thêm CSS động nếu cần
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
});