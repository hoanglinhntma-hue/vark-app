// Khởi tạo ứng dụng
document.addEventListener('DOMContentLoaded', function() {
    // Hiển thị thống kê trên trang chủ
    updateStats();
    
    // Hiển thị kết quả gần nhất
    showLatestResult();
});

// Cập nhật thống kê
function updateStats() {
    const results = Storage.getResults();
    const quizCount = document.getElementById('quizCount');
    const dominantStyle = document.getElementById('dominantStyle');
    const lastDate = document.getElementById('lastDate');
    
    if (quizCount) quizCount.textContent = results.length;
    
    if (results.length > 0) {
        const latest = results[results.length - 1];
        if (dominantStyle) {
            const dominant = latest.dominant[0] || 'Chưa xác định';
            dominantStyle.textContent = getStyleName(dominant);
        }
        if (lastDate) lastDate.textContent = latest.date;
    }
}

// Hiển thị kết quả gần nhất
function showLatestResult() {
    const lastResultDiv = document.getElementById('lastResult');
    if (!lastResultDiv) return;
    
    const latest = Storage.getLatestResult();
    if (latest) {
        lastResultDiv.innerHTML = `
            <div class="last-result-card">
                <h4><i class="fas fa-chart-pie"></i> Kết quả gần nhất (${latest.date})</h4>
                <div class="result-summary">
                    <p>Phong cách chính: <strong>${getStyleName(latest.dominant[0])}</strong></p>
                    <p>Điểm số: V=${latest.scores.V} | A=${latest.scores.A} | R=${latest.scores.R} | K=${latest.scores.K}</p>
                    <a href="results.html?id=${latest.id}" class="btn-small">Xem chi tiết</a>
                </div>
            </div>
        `;
    } else {
        lastResultDiv.innerHTML = `
            <div class="last-result-card">
                <h4><i class="fas fa-info-circle"></i> Chưa có kết quả</h4>
                <p>Bạn chưa làm trắc nghiệm lần nào. Hãy bắt đầu ngay!</p>
            </div>
        `;
    }
}

// Chuyển đổi mã phong cách thành tên đầy đủ
function getStyleName(code) {
    const styles = {
        'V': 'Visual (Hình ảnh)',
        'A': 'Aural (Thính giác)',
        'R': 'Read/Write (Đọc/Viết)',
        'K': 'Kinesthetic (Vận động)'
    };
    return styles[code] || code;
}