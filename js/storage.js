// Quản lý dữ liệu với localStorage
const Storage = {
    // Lưu kết quả
    saveResult: function(result) {
        let results = this.getResults();
        result.id = Date.now(); // ID duy nhất
        result.date = new Date().toLocaleDateString('vi-VN');
        results.push(result);
        localStorage.setItem('vark_results', JSON.stringify(results));
        return result.id;
    },

    // Lấy tất cả kết quả
    getResults: function() {
        const results = localStorage.getItem('vark_results');
        return results ? JSON.parse(results) : [];
    },

    // Xóa kết quả theo ID
    deleteResult: function(id) {
        let results = this.getResults();
        results = results.filter(r => r.id !== id);
        localStorage.setItem('vark_results', JSON.stringify(results));
        return true;
    },

    // Xóa tất cả kết quả
    clearAllResults: function() {
        localStorage.removeItem('vark_results');
        return true;
    },

    // Lấy kết quả gần nhất
    getLatestResult: function() {
        const results = this.getResults();
        if (results.length === 0) return null;
        return results[results.length - 1];
    },

    // Lưu cài đặt
    saveSettings: function(settings) {
        localStorage.setItem('vark_settings', JSON.stringify(settings));
    },

    // Lấy cài đặt
    getSettings: function() {
        const settings = localStorage.getItem('vark_settings');
        return settings ? JSON.parse(settings) : {
            fontSize: 'medium',
            notifications: true,
            darkMode: false
        };
    }
};