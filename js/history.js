// History Page
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
                    <i class="fas fa-clipboard-list"></i>
                    <h3>Chưa có lịch sử nào</h3>
                    <p>Hãy làm trắc nghiệm đầu tiên để xem kết quả ở đây</p>
                    <a href="quiz.html" class="btn-primary">Làm trắc nghiệm ngay</a>
                </div>
            `;
            if (clearSection) clearSection.style.display = 'none';
            return;
        }
        
        // Sắp xếp theo thời gian mới nhất
        this.results.sort((a, b) => b.id - a.id);
        
        let html = '';
        this.results.forEach(result => {
            const mainStyle = result.dominant[0] || 'V';
            const date = result.date || 'Không xác định';
            
            html += `
                <div class="history-item history-item-${mainStyle}">
                    <div class="history-info">
                        <h4>Kết quả ngày ${date}</h4>
                        <p>Phong cách chính: <strong>${this.getStyleName(mainStyle)}</strong></p>
                        <p>Điểm: V=${result.scores.V} A=${result.scores.A} R=${result.scores.R} K=${result.scores.K}</p>
                    </div>
                    
                    <div class="history-actions">
                        <a href="results.html?id=${result.id}" class="btn-small btn-view">
                            <i class="fas fa-eye"></i> Xem
                        </a>
                        <button class="btn-small btn-delete" data-id="${result.id}">
                            <i class="fas fa-trash"></i> Xóa
                        </button>
                    </div>
                </div>
            `;
        });
        
        list.innerHTML = html;
        if (clearSection) clearSection.style.display = 'block';
        
        // Thêm sự kiện cho nút xóa
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                if (confirm('Bạn có chắc muốn xóa kết quả này?')) {
                    this.deleteResult(id);
                }
            });
        });
    }
    
    updateCount() {
        const countElement = document.getElementById('historyCount');
        if (countElement) {
            countElement.textContent = `Bạn đã làm trắc nghiệm ${this.results.length} lần`;
        }
    }
    
    deleteResult(id) {
        Storage.deleteResult(id);
        this.loadHistory(); // Tải lại
    }
    
    setupEventListeners() {
        const clearAllBtn = document.getElementById('clearAllBtn');
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', () => {
                if (confirm('Bạn có chắc muốn xóa TẤT CẢ lịch sử? Hành động này không thể hoàn tác.')) {
                    Storage.clearAllResults();
                    this.loadHistory();
                }
            });
        }
    }
    
    getStyleName(code) {
        const styles = {
            'V': 'Visual',
            'A': 'Aural',
            'R': 'Read/Write',
            'K': 'Kinesthetic'
        };
        return styles[code] || code;
    }
}

// Khởi tạo trang lịch sử
document.addEventListener('DOMContentLoaded', () => {
    new HistoryPage();
});