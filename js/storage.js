// js/storage.js
const Storage = {
    // Lưu kết quả bài trắc nghiệm
    saveResult: function(result) {
        try {
            let results = this.getResults();
            
            // Tạo ID duy nhất
            result.id = 'result_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            
            // Đảm bảo có ngày tháng
            if (!result.date) {
                result.date = new Date().toLocaleDateString('vi-VN');
            }
            if (!result.timestamp) {
                result.timestamp = new Date().toISOString();
            }
            
            // Đảm bảo có cấu trúc đầy đủ
            result.totalQuestions = result.totalQuestions || 16;
            result.answeredCount = result.answers ? Object.keys(result.answers).length : 0;
            
            results.unshift(result); // Thêm vào đầu để mới nhất lên trước
            
            localStorage.setItem('vark_results', JSON.stringify(results));
            console.log('Kết quả đã lưu với ID:', result.id);
            return result.id;
        } catch (error) {
            console.error('Lỗi khi lưu kết quả:', error);
            return null;
        }
    },

    // Lấy tất cả kết quả
    getResults: function() {
        try {
            const results = localStorage.getItem('vark_results');
            if (!results) return [];
            
            const parsed = JSON.parse(results);
            
            // Kiểm tra và sửa cấu trúc cũ (nếu có)
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            console.error('Lỗi khi đọc kết quả:', error);
            return [];
        }
    },

    // Lấy kết quả theo ID
    getResultById: function(id) {
        try {
            const results = this.getResults();
            return results.find(r => r.id === id) || null;
        } catch (error) {
            console.error('Lỗi khi tìm kết quả:', error);
            return null;
        }
    },

    // Xóa một kết quả
    deleteResult: function(id) {
        try {
            let results = this.getResults();
            const initialLength = results.length;
            results = results.filter(r => r.id !== id);
            
            if (results.length < initialLength) {
                localStorage.setItem('vark_results', JSON.stringify(results));
                console.log('Đã xóa kết quả ID:', id);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Lỗi khi xóa kết quả:', error);
            return false;
        }
    },

    // Xóa tất cả kết quả
    clearAllResults: function() {
        try {
            localStorage.removeItem('vark_results');
            console.log('Đã xóa tất cả kết quả');
            return true;
        } catch (error) {
            console.error('Lỗi khi xóa tất cả kết quả:', error);
            return false;
        }
    },

    // Lấy kết quả mới nhất
    getLatestResult: function() {
        const results = this.getResults();
        return results.length > 0 ? results[0] : null; // Vì đã unshift nên phần tử đầu là mới nhất
    },

    // Lấy kết quả theo chỉ số (cho lịch sử)
    getResultsByPage: function(page = 1, itemsPerPage = 10) {
        const results = this.getResults();
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        
        return {
            data: results.slice(startIndex, endIndex),
            total: results.length,
            page: page,
            totalPages: Math.ceil(results.length / itemsPerPage)
        };
    },

    // Lưu cài đặt
    saveSettings: function(settings) {
        try {
            const defaultSettings = this.getDefaultSettings();
            const mergedSettings = { ...defaultSettings, ...settings };
            localStorage.setItem('vark_settings', JSON.stringify(mergedSettings));
            return true;
        } catch (error) {
            console.error('Lỗi khi lưu cài đặt:', error);
            return false;
        }
    },

    // Lấy cài đặt
    getSettings: function() {
        try {
            const settings = localStorage.getItem('vark_settings');
            if (!settings) return this.getDefaultSettings();
            
            const parsed = JSON.parse(settings);
            return { ...this.getDefaultSettings(), ...parsed };
        } catch (error) {
            console.error('Lỗi khi đọc cài đặt:', error);
            return this.getDefaultSettings();
        }
    },

    // Cài đặt mặc định
    getDefaultSettings: function() {
        return {
            fontSize: 'medium', // small, medium, large
            theme: 'light', // light, dark
            language: 'vi',
            notifications: true,
            vibration: false,
            saveHistory: true
        };
    },

    // Lưu câu hỏi đã tải (cache)
    cacheQuestions: function(questions) {
        try {
            const cache = {
                questions: questions,
                timestamp: Date.now(),
                version: '1.0'
            };
            localStorage.setItem('vark_questions_cache', JSON.stringify(cache));
            return true;
        } catch (error) {
            console.error('Lỗi khi cache câu hỏi:', error);
            return false;
        }
    },

    // Lấy câu hỏi từ cache
    getCachedQuestions: function() {
        try {
            const cache = localStorage.getItem('vark_questions_cache');
            if (!cache) return null;
            
            const parsed = JSON.parse(cache);
            // Kiểm tra cache còn hiệu lực (1 ngày)
            if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
                return parsed.questions;
            }
            return null;
        } catch (error) {
            console.error('Lỗi khi đọc cache câu hỏi:', error);
            return null;
        }
    },

    // Kiểm tra dung lượng
    getStorageInfo: function() {
        try {
            let total = 0;
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    total += (localStorage[key].length * 2) / 1024; // KB
                }
            }
            
            return {
                totalKB: Math.round(total * 100) / 100,
                resultsCount: this.getResults().length,
                hasSettings: !!localStorage.getItem('vark_settings'),
                hasCache: !!localStorage.getItem('vark_questions_cache')
            };
        } catch (error) {
            console.error('Lỗi khi kiểm tra storage:', error);
            return null;
        }
    }
};

// Tự động nâng cấp dữ liệu cũ (nếu có)
Storage.migrateOldData = function() {
    try {
        // Kiểm tra phiên bản cũ
        const oldResults = localStorage.getItem('varkResults'); // camelCase cũ
        if (oldResults && !localStorage.getItem('vark_results')) {
            console.log('Đang nâng cấp dữ liệu cũ...');
            localStorage.setItem('vark_results', oldResults);
            
            // Thêm ID nếu chưa có
            const results = JSON.parse(oldResults);
            results.forEach((result, index) => {
                if (!result.id) {
                    result.id = 'migrated_' + Date.now() + '_' + index;
                }
            });
            
            localStorage.setItem('vark_results', JSON.stringify(results));
            localStorage.removeItem('varkResults');
        }
    } catch (error) {
        console.error('Lỗi khi nâng cấp dữ liệu:', error);
    }
};

// Chạy nâng cấp khi tải
if (typeof window !== 'undefined') {
    Storage.migrateOldData();
}

// Xuất ra global (cho các file JS khác sử dụng)
if (typeof window !== 'undefined') {
    window.Storage = Storage;
}

// Export cho module (nếu dùng ES6)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Storage;
}