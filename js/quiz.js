// Quiz Application
class Quiz {
    constructor() {
        this.questions = [];
        this.currentQuestion = 0;
        this.answers = {};
        this.totalQuestions = 0;
        
        this.init();
    }
    
    async init() {
        await this.loadQuestions();
        this.renderQuestion();
        this.setupEventListeners();
        this.updateProgress();
    }
    
    async loadQuestions() {
        try {
            // Trong thực tế, bạn sẽ fetch từ file JSON
            // Đây là dữ liệu mẫu để demo
            this.questions = [
                {
                    id: 1,
                    text: "Khi học về một loài động vật mới, bạn thích:",
                    options: [
                        {"text": "Xem hình ảnh hoặc video về nó", "type": "V"},
                        {"text": "Nghe thuyết trình hoặc âm thanh của nó", "type": "A"},
                        {"text": "Đọc mô tả và ghi chép về nó", "type": "R"},
                        {"text": "Đến vườn thú để quan sát trực tiếp", "type": "K"}
                    ]
                },
                // Thêm các câu hỏi khác ở đây...
                {
                    id: 2,
                    text: "Khi lắp ráp đồ nội thất, bạn thường:",
                    options: [
                        {"text": "Xem kỹ hình ảnh hướng dẫn", "type": "V"},
                        {"text": "Gọi điện hỏi người khác", "type": "A"},
                        {"text": "Đọc kỹ hướng dẫn sử dụng", "type": "R"},
                        {"text": "Thử lắp trực tiếp, sai thì sửa", "type": "K"}
                    ]
                },
                {
                    id: 3,
                    text: "Khi học từ vựng ngoại ngữ, bạn thích:",
                    options: [
                        {"text": "Sử dụng thẻ học với hình ảnh", "type": "V"},
                        {"text": "Nghe phát âm và lặp lại", "type": "A"},
                        {"text": "Viết đi viết lại nhiều lần", "type": "R"},
                        {"text": "Sử dụng trong tình huống thực tế", "type": "K"}
                    ]
                }
            ];
            
            this.totalQuestions = this.questions.length;
        } catch (error) {
            console.error('Error loading questions:', error);
        }
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
        }
    }
    
    nextQuestion() {
        if (this.currentQuestion < this.totalQuestions - 1) {
            this.currentQuestion++;
            this.renderQuestion();
            this.updateProgress();
            this.updateNavigationButtons();
        }
    }
    
    updateProgress() {
        const progress = ((this.currentQuestion + 1) / this.totalQuestions) * 100;
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
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
    
    submitQuiz() {
        // Tính điểm
        const scores = { V: 0, A: 0, R: 0, K: 0 };
        
        Object.values(this.answers).forEach(type => {
            if (scores[type] !== undefined) {
                scores[type]++;
            }
        });
        
        // Xác định phong cách chính
        const maxScore = Math.max(...Object.values(scores));
        const dominant = Object.keys(scores).filter(type => scores[type] === maxScore);
        
        // Tạo kết quả
        const result = {
            scores: scores,
            dominant: dominant,
            answers: this.answers,
            timestamp: new Date().toISOString()
        };
        
        // Lưu kết quả
        const resultId = Storage.saveResult(result);
        
        // Chuyển đến trang kết quả
        window.location.href = `results.html?id=${resultId}`;
    }
}

// Khởi tạo quiz khi trang tải xong
document.addEventListener('DOMContentLoaded', () => {
    new Quiz();
});