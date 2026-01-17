// Settings Page
class SettingsPage {
    constructor() {
        this.settings = {};
        this.init();
    }
    
    init() {
        this.loadSettings();
        this.setupEventListeners();
    }
    
    loadSettings() {
        this.settings = Storage.getSettings();
        
        // Áp dụng lên giao diện
        document.getElementById('fontSize').value = this.settings.fontSize || 'medium';
        document.getElementById('darkMode').checked = this.settings.darkMode || false;
        document.getElementById('notifications').checked = this.settings.notifications !== false;
        
        // Áp dụng cỡ chữ
        this.applyFontSize();
    }
    
    setupEventListeners() {
        // Lưu cài đặt
        document.getElementById('saveSettings').addEventListener('click', () => this.saveSettings());
        
        // Xuất dữ liệu
        document.getElementById('exportData').addEventListener('click', () => this.exportData());
        
        // Nhập dữ liệu
        document.getElementById('importBtn').addEventListener('click', () => {
            document.getElementById('importFile').click();
        });
        
        document.getElementById('importFile').addEventListener('change', (e) => this.importData(e));
        
        // Reset tất cả
        document.getElementById('resetAll').addEventListener('click', () => this.resetAllData());
        
        // Thay đổi cỡ chữ tức thì
        document.getElementById('fontSize').addEventListener('change', () => this.applyFontSize());
        
        // Thay đổi chế độ tối tức thì
        document.getElementById('darkMode').addEventListener('change', () => this.applyDarkMode());
    }
    
    applyFontSize() {
        const fontSize = document.getElementById('fontSize').value;
        const sizes = {
            'small': '14px',
            'medium': '16px',
            'large': '18px',
            'xlarge': '20px'
        };
        
        document.body.style.fontSize = sizes[fontSize] || '16px';
    }
    
    applyDarkMode() {
        const darkMode = document.getElementById('darkMode').checked;
        if (darkMode) {
            document.body.style.backgroundColor = '#1a1a1a';
            document.body.style.color = '#ffffff';
            document.querySelector('.container').style.backgroundColor = '#2c3e50';
            document.querySelector('.container').style.color = '#ffffff';
        } else {
            document.body.style.backgroundColor = '';
            document.body.style.color = '';
            document.querySelector('.container').style.backgroundColor = '';
            document.querySelector('.container').style.color = '';
        }
    }
    
    saveSettings() {
        this.settings = {
            fontSize: document.getElementById('fontSize').value,
            darkMode: document.getElementById('darkMode').checked,
            notifications: document.getElementById('notifications').checked
        };
        
        Storage.saveSettings(this.settings);
        
        // Hiển thị thông báo
        alert('Đã lưu cài đặt thành công!');
    }
    
    exportData() {
        const data = {
            results: Storage.getResults(),
            settings: Storage.getSettings(),
            exportedAt: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `vark-data-${new Date().toISOString().slice(0,10)}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        alert('Đã xuất dữ liệu thành công!');
    }
    
    importData(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (confirm('Bạn có chắc muốn nhập dữ liệu này? Dữ liệu hiện tại sẽ bị ghi đè.')) {
                    if (data.results) {
                        localStorage.setItem('vark_results', JSON.stringify(data.results));
                    }
                    
                    if (data.settings) {
                        localStorage.setItem('vark_settings', JSON.stringify(data.settings));
                        this.loadSettings(); // Tải lại cài đặt
                    }
                    
                    alert('Đã nhập dữ liệu thành công!');
                    window.location.reload();
                }
            } catch (error) {
                alert('Lỗi: File không hợp lệ!');
                console.error(error);
            }
        };
        
        reader.readAsText(file);
        event.target.value = ''; // Reset input file
    }
    
    resetAllData() {
        if (confirm('BẠN CÓ CHẮC CHẮN MUỐN XÓA TẤT CẢ DỮ LIỆU?\n\n• Tất cả kết quả trắc nghiệm sẽ bị xóa\n• Cài đặt sẽ trở về mặc định\n• Hành động này KHÔNG THỂ hoàn tác')) {
            localStorage.clear();
            alert('Đã xóa toàn bộ dữ liệu. Ứng dụng sẽ tải lại...');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }
    }
}

// Khởi tạo trang cài đặt
document.addEventListener('DOMContentLoaded', () => {
    new SettingsPage();
});