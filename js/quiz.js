// Quiz Application với 16 câu hỏi VARK chuẩn
class Quiz {
    constructor() {
        this.questions = [];
        this.currentQuestion = 0;
        this.answers = {};
        this.totalQuestions = 0;
        
        this.init();
    }
    
    async init() {
        this.loadQuestions();
        this.renderQuestion();
        this.setupEventListeners();
        this.updateProgress();
        this.updateQuestionCounter();
        this.updateCurrentQuestion();
    }
    
    loadQuestions() {
        // Bộ 16 câu hỏi VARK chuẩn
        this.questions = [
            {
                id: 1,
                text: "Bạn đang ở một thành phố mới và muốn khám phá các địa điểm tham quan. Bạn thích:",
                options: [
                    {"text": "Sử dụng bản đồ hoặc ứng dụng chỉ đường có hình ảnh", "type": "V"},
                    {"text": "Hỏi người dân địa phương để được chỉ dẫn", "type": "A"},
                    {"text": "Mua sách hướng dẫn du lịch để đọc", "type": "R"},
                    {"text": "Đi bộ khám phá ngẫu nhiên, tự mình tìm đường", "type": "K"}
                ]
            },
            {
                id: 2,
                text: "Khi học cách sử dụng một phần mềm mới, bạn thường:",
                options: [
                    {"text": "Xem video hướng dẫn hoặc ảnh chụp màn hình", "type": "V"},
                    {"text": "Gọi cho bộ phận hỗ trợ kỹ thuật để được hướng dẫn", "type": "A"},
                    {"text": "Đọc hướng dẫn sử dụng hoặc tài liệu trực tuyến", "type": "R"},
                    {"text": "Tự mình thử nghiệm các tính năng của phần mềm", "type": "K"}
                ]
            },
            {
                id: 3,
                text: "Khi muốn học nấu một món ăn mới, bạn thích:",
                options: [
                    {"text": "Xem video hướng dẫn nấu ăn", "type": "V"},
                    {"text": "Gọi điện cho ai đó để được hướng dẫn từng bước", "type": "A"},
                    {"text": "Đọc công thức trong sách dạy nấu ăn", "type": "R"},
                    {"text": "Trực tiếp vào bếp và thử nấu", "type": "K"}
                ]
            },
            {
                id: 4,
                text: "Khi ghi nhớ một danh sách (như danh sách mua sắm), bạn thường:",
                options: [
                    {"text": "Hình dung các món đồ trong đầu", "type": "V"},
                    {"text": "Đọc to danh sách nhiều lần", "type": "A"},
                    {"text": "Viết danh sách ra giấy", "type": "R"},
                    {"text": "Đi mua và nhớ theo thứ tự các gian hàng", "type": "K"}
                ]
            },
            {
                id: 5,
                text: "Khi ôn tập cho kỳ thi, bạn thấy hiệu quả nhất khi:",
                options: [
                    {"text": "Sử dụng sơ đồ tư duy, biểu đồ, hình ảnh", "type": "V"},
                    {"text": "Thảo luận với bạn bè hoặc tự giảng giải lại", "type": "A"},
                    {"text": "Viết lại ghi chép và đọc tài liệu nhiều lần", "type": "R"},
                    {"text": "Làm nhiều bài tập thực hành", "type": "K"}
                ]
            },
            {
                id: 6,
                text: "Khi tham dự một bài giảng hoặc hội thảo, bạn thường:",
                options: [
                    {"text": "Tập trung vào các slide trình chiếu và hình ảnh", "type": "V"},
                    {"text": "Chú ý lắng nghe người nói", "type": "A"},
                    {"text": "Ghi chép chi tiết những gì được trình bày", "type": "R"},
                    {"text": "Thực hành ngay nếu có cơ hội", "type": "K"}
                ]
            },
            {
                id: 7,
                text: "Khi cần hướng dẫn đường đi cho người khác, bạn thường:",
                options: [
                    {"text": "Vẽ bản đồ hoặc sơ đồ đường đi", "type": "V"},
                    {"text": "Mô tả bằng lời chi tiết từng bước", "type": "A"},
                    {"text": "Viết ra tên đường và các mốc quan trọng", "type": "R"},
                    {"text": "Đề nghị dẫn họ đi một đoạn đầu tiên", "type": "K"}
                ]
            },
            {
                id: 8,
                text: "Khi học một kỹ năng thể thao mới (như chơi tennis), bạn thích:",
                options: [
                    {"text": "Xem video phân tích kỹ thuật", "type": "V"},
                    {"text": "Nghe huấn luyện viên giải thích", "type": "A"},
                    {"text": "Đọc sách hướng dẫn kỹ thuật", "type": "R"},
                    {"text": "Trực tiếp ra sân và thực hành", "type": "K"}
                ]
            },
            {
                id: 9,
                text: "Khi cần chọn quần áo để mua, bạn thường:",
                options: [
                    {"text": "Nhìn vào hình ảnh trên tạp chí hoặc mạng xã hội", "type": "V"},
                    {"text": "Hỏi ý kiến bạn bè hoặc nhân viên bán hàng", "type": "A"},
                    {"text": "Đọc các bài đánh giá và mô tả chất liệu", "type": "R"},
                    {"text": "Mặc thử để cảm nhận chất liệu và độ vừa vặn", "type": "K"}
                ]
            },
            {
                id: 10,
                text: "Khi gặp khó khăn với một vấn đề kỹ thuật (như máy tính hỏng), bạn:",
                options: [
                    {"text": "Tìm kiếm hướng dẫn bằng hình ảnh trên internet", "type": "V"},
                    {"text": "Gọi điện cho người có chuyên môn để được tư vấn", "type": "A"},
                    {"text": "Đọc tài liệu hướng dẫn sửa chữa", "type": "R"},
                    {"text": "Tự mình tháo ra và kiểm tra các bộ phận", "type": "K"}
                ]
            },
            {
                id: 11,
                text: "Khi học về lịch sử, bạn tiếp thu tốt nhất khi:",
                options: [
                    {"text": "Xem phim tài liệu, bản đồ và hình ảnh lịch sử", "type": "V"},
                    {"text": "Nghe kể chuyện lịch sử hoặc thảo luận", "type": "A"},
                    {"text": "Đọc sách giáo khoa và ghi chép", "type": "R"},
                    {"text": "Đến thăm bảo tàng hoặc di tích lịch sử", "type": "K"}
                ]
            },
            {
                id: 12,
                text: "Khi muốn nhớ tên của một người mới gặp, bạn thường:",
                options: [
                    {"text": "Liên tưởng khuôn mặt họ với một hình ảnh nào đó", "type": "V"},
                    {"text": "Lặp lại tên họ thành tiếng nhiều lần trong cuộc trò chuyện", "type": "A"},
                    {"text": "Viết tên họ ra giấy sau khi gặp", "type": "R"},
                    {"text": "Liên kết tên họ với một hành động hoặc cử chỉ", "type": "K"}
                ]
            },
            {
                id: 13,
                text: "Khi cần quyết định xem phim gì, bạn thường:",
                options: [
                    {"text": "Xem trailer và poster của phim", "type": "V"},
                    {"text": "Nghe ý kiến đánh giá từ bạn bè", "type": "A"},
                    {"text": "Đọc review và tóm tắt nội dung phim", "type": "R"},
                    {"text": "Thử xem một vài phút đầu để quyết định", "type": "K"}
                ]
            },
            {
                id: 14,
                text: "Khi học một bài hát mới, bạn thường:",
                options: [
                    {"text": "Xem video ca nhạc hoặc lời bài hát được hiển thị", "type": "V"},
                    {"text": "Nghe bài hát nhiều lần và hát theo", "type": "A"},
                    {"text": "Đọc lời bài hát và ghi nhớ", "type": "R"},
                    {"text": "Vừa nghe vừa nhún nhảy hoặc vỗ tay theo nhịp", "type": "K"}
                ]
            },
            {
                id: 15,
                text: "Khi cần lắp ráp một món đồ mới mua, bạn:",
                options: [
                    {"text": "Nhìn vào hình minh họa trong hướng dẫn", "type": "V"},
                    {"text": "Nhờ ai đó đọc hướng dẫn cho bạn nghe", "type": "A"},
                    {"text": "Đọc kỹ hướng dẫn sử dụng trước khi bắt đầu", "type": "R"},
                    {"text": "Bắt tay vào lắp ngay, xem hướng dẫn chỉ khi cần", "type": "K"}
                ]
            },
            {
                id: 16,
                text: "Khi muốn học về một loài động vật mới, bạn thích nhất việc:",
                options: [
                    {"text": "Xem hình ảnh và video về chúng", "type": "V"},
                    {"text": "Nghe tiếng kêu và mô tả về chúng", "type": "A"},
                    {"text": "Đọc thông tin và ghi chú về đặc điểm của chúng", "type": "R"},
                    {"text": "Đến vườn thú để quan sát trực tiếp", "type": "K"}
                ]
            }
        ];
        
        this.totalQuestions = this.questions.length;
    }
    
    renderQuestion() {
        const container = document.getElementById('questionsContainer');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.questions.forEach((question, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.className = `question-card ${index === this.currentQuestion ? 'active' : ''}`;
            questionDiv.dataset.index = index;
            
            // Tạo HTML cho câu hỏi
            let optionsHTML = '';
            question.options.forEach((option, optIndex) => {
                const isSelected = this.answers[question.id] === option.type;
                optionsHTML += `
                    <div class="option ${isSelected ? 'selected' : ''}" 
                         data-type="${option.type}" 
                         data-question="${question.id}">
                        <div class="option-icon icon-${option.type}">${option.type}</div>
                        <span>${option.text}</span>
                    </div>
                `;
            });
            
            questionDiv.innerHTML = `
                <div class="question-number">
                    <i class="fas fa-question"></i> Câu ${index + 1}/${this.totalQuestions}
                </div>
                <div class="question-text">${question.text}</div>
                <div class="options">${optionsHTML}</div>
            `;
            
            container.appendChild(questionDiv);
        });
        
        // Thêm sự kiện click cho các lựa chọn
        document.querySelectorAll('.option').forEach(option => {
            option.addEventListener('click', (e) => {
                const type = e.currentTarget.dataset.type;
                const questionId = parseInt(e.currentTarget.dataset.question);
                this.selectAnswer(questionId, type);
            });
        });
    }
    
    selectAnswer(questionId, type) {
        // Lưu câu trả lời
        this.answers[questionId] = type;
        
        // Cập nhật giao diện
        document.querySelectorAll(`[data-question="${questionId}"]`).forEach(option => {
            option.classList.remove('selected');
        });
        
        const selectedOption = document.querySelector(`[data-question="${questionId}"][data-type="${type}"]`);
        if (selectedOption) {
            selectedOption.classList.add('selected');
        }
        
        // Cập nhật bộ đếm
        this.updateQuestionCounter();
    }
    
    setupEventListeners() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const submitBtn = document.getElementById('submitBtn');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prevQuestion());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextQuestion());
        }
        
        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.submitQuiz());
        }
    }
    
    prevQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.renderQuestion();
            this.updateProgress();
            this.updateNavigationButtons();
            this.updateCurrentQuestion();
        }
    }
    
    nextQuestion() {
        if (this.currentQuestion < this.totalQuestions - 1) {
            this.currentQuestion++;
            this.renderQuestion();
            this.updateProgress();
            this.updateNavigationButtons();
            this.updateCurrentQuestion();
        }
    }
    
    updateProgress() {
        const progress = ((this.currentQuestion + 1) / this.totalQuestions) * 100;
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    }
    
    updateQuestionCounter() {
        const answeredCount = Object.keys(this.answers).length;
        const counterElement = document.getElementById('answeredCounter');
        
        if (counterElement) {
            counterElement.textContent = `Đã trả lời: ${answeredCount}/${this.totalQuestions}`;
        }
    }
    
    updateCurrentQuestion() {
        const currentElement = document.getElementById('currentQuestion');
        if (currentElement) {
            currentElement.textContent = `Câu: ${this.currentQuestion + 1}/${this.totalQuestions}`;
        }
    }
    
    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const submitBtn = document.getElementById('submitBtn');
        
        if (prevBtn) {
            prevBtn.style.visibility = this.currentQuestion === 0 ? 'hidden' : 'visible';
        }
        
        if (nextBtn && submitBtn) {
            if (this.currentQuestion === this.totalQuestions - 1) {
                nextBtn.style.display = 'none';
                submitBtn.style.display = 'flex';
            } else {
                nextBtn.style.display = 'flex';
                submitBtn.style.display = 'none';
            }
        }
    }
    
    calculateResults() {
        // Tính điểm cho từng phong cách
        const scores = { V: 0, A: 0, R: 0, K: 0 };
        
        // Đếm số lựa chọn cho mỗi phong cách
        Object.values(this.answers).forEach(type => {
            if (scores[type] !== undefined) {
                scores[type]++;
            }
        });
        
        return scores;
    }
    
    determineDominantStyles(scores) {
        // Tìm điểm cao nhất
        const maxScore = Math.max(...Object.values(scores));
        
        // Tìm tất cả phong cách có điểm bằng điểm cao nhất
        const dominant = Object.keys(scores).filter(type => scores[type] === maxScore);
        
        return dominant;
    }
    
    generateAdvice(scores, dominant) {
        // Phân loại theo điểm số
        const totalAnswers = Object.values(scores).reduce((a, b) => a + b, 0);
        const percentages = {};
        
        // Tính phần trăm cho mỗi phong cách
        Object.keys(scores).forEach(type => {
            percentages[type] = Math.round((scores[type] / totalAnswers) * 100);
        });
        
        // Tạo lời khuyên dựa trên phong cách chính
        let advice = "";
        
        if (dominant.length === 1) {
            const mainStyle = dominant[0];
            advice = `Bạn là người học chủ yếu qua phong cách ${this.getStyleFullName(mainStyle)} `;
            advice += `(${percentages[mainStyle]}%). Hãy tập trung vào phương pháp học phù hợp.`;
        } else {
            advice = `Bạn có đa phong cách học tập: ${dominant.map(s => this.getStyleFullName(s)).join(', ')}. `;
            advice += `Đây là lợi thế lớn! Bạn có thể kết hợp nhiều phương pháp học khác nhau.`;
        }
        
        return {
            summary: advice,
            percentages: percentages,
            scores: scores
        };
    }
    
    submitQuiz() {
        // Kiểm tra xem đã trả lời đủ câu hỏi chưa
        const answeredCount = Object.keys(this.answers).length;
        if (answeredCount < this.totalQuestions) {
            if (!confirm(`Bạn mới trả lời ${answeredCount}/${this.totalQuestions} câu. Bạn có muốn nộp bài ngay không?`)) {
                return;
            }
        }
        
        // Tính kết quả
        const scores = this.calculateResults();
        const dominant = this.determineDominantStyles(scores);
        const advice = this.generateAdvice(scores, dominant);
        
        // Tạo đối tượng kết quả
        const result = {
            scores: scores,
            dominant: dominant,
            answers: this.answers,
            percentages: advice.percentages,
            advice: advice.summary,
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString('vi-VN')
        };
        
        // Lưu kết quả
        const resultId = Storage.saveResult(result);
        
        // Chuyển đến trang kết quả
        window.location.href = `results.html?id=${resultId}`;
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
}

// Khởi tạo quiz khi trang tải xong
document.addEventListener('DOMContentLoaded', () => {
    new Quiz();
});