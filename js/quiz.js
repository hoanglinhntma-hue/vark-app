// js/quiz.js
class Quiz {
    constructor() {
        this.questions = [];
        this.currentQuestion = 0;
        this.answers = {}; // Lưu dạng {questionId: 'A'/'B'/'C'/'D'}
        this.totalQuestions = 0;
        this.varkMapping = {}; // Ánh xạ A/B/C/D -> V/A/R/K cho từng câu
        
        this.init();
    }
    
    async init() {
        await this.loadQuestionsFromJSON();
        this.renderQuestion();
        this.setupEventListeners();
        this.updateProgress();
        this.updateQuestionCounter();
        this.updateCurrentQuestion();
    }
    
    async loadQuestionsFromJSON() {
        try {
            const response = await fetch('../data/questions.json');
            this.questions = await response.json();
            this.totalQuestions = this.questions.length;
            
            // Tạo ánh xạ VARK ngẫu nhiên cho mỗi câu
            this.generateVARKMapping();
        } catch (error) {
            console.error('Lỗi khi tải câu hỏi:', error);
            // Fallback: dùng câu hỏi mặc định (nếu có)
            this.loadDefaultQuestions();
        }
    }
    
    generateVARKMapping() {
        const styles = ['V', 'A', 'R', 'K'];
        
        this.questions.forEach((question, index) => {
            // Tạo một bản sao đã xáo trộn của styles cho mỗi câu
            const shuffled = [...styles].sort(() => Math.random() - 0.5);
            
            // Ánh xạ: A -> shuffled[0], B -> shuffled[1], ...
            const mapping = {};
            const letters = ['A', 'B', 'C', 'D'];
            letters.forEach((letter, i) => {
                mapping[letter] = shuffled[i];
            });
            
            this.varkMapping[question.id] = mapping;
        });
        
        console.log('VARK Mapping:', this.varkMapping); // Debug
    }
    
    loadDefaultQuestions() {
        // Fallback nếu không load được JSON
        this.questions = [
            {
                id: 1,
                text: "Câu hỏi mẫu 1",
                options: [
                    {text: "Lựa chọn A", type: "A"},
                    {text: "Lựa chọn B", type: "B"},
                    {text: "Lựa chọn C", type: "C"},
                    {text: "Lựa chọn D", type: "D"}
                ]
            }
        ];
        this.totalQuestions = this.questions.length;
        this.generateVARKMapping();
    }
    
    renderQuestion() {
        const container = document.getElementById('questionsContainer');
        if (!container || this.questions.length === 0) return;
        
        container.innerHTML = '';
        
        this.questions.forEach((question, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.className = `question-card ${index === this.currentQuestion ? 'active' : ''}`;
            questionDiv.dataset.index = index;
            
            let optionsHTML = '';
            question.options.forEach((option, optIndex) => {
                const isSelected = this.answers[question.id] === option.type;
                const letter = String.fromCharCode(65 + optIndex); // A, B, C, D
                optionsHTML += `
                    <div class="option ${isSelected ? 'selected' : ''}" 
                         data-type="${option.type}" 
                         data-question="${question.id}"
                         data-letter="${letter}">
                        <div class="option-letter">${letter}</div>
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
                const type = e.currentTarget.dataset.type; // A/B/C/D
                const questionId = parseInt(e.currentTarget.dataset.question);
                this.selectAnswer(questionId, type);
            });
        });
    }
    
    selectAnswer(questionId, type) {
        this.answers[questionId] = type;
        
        // Cập nhật giao diện
        document.querySelectorAll(`[data-question="${questionId}"]`).forEach(option => {
            option.classList.remove('selected');
        });
        
        const selectedOption = document.querySelector(`[data-question="${questionId}"][data-type="${type}"]`);
        if (selectedOption) {
            selectedOption.classList.add('selected');
        }
        
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
    
    calculateVARKscores() {
        const scores = { V: 0, A: 0, R: 0, K: 0 };
        
        // Duyệt qua tất cả câu trả lời (dạng A/B/C/D)
        Object.entries(this.answers).forEach(([questionId, answerType]) => {
            const mapping = this.varkMapping[questionId];
            if (mapping && mapping[answerType]) {
                const varkType = mapping[answerType]; // Chuyển A/B/C/D -> V/A/R/K
                scores[varkType]++;
            }
        });
        
        return scores;
    }
    
    determineDominantStyles(scores) {
        const maxScore = Math.max(...Object.values(scores));
        const dominant = Object.keys(scores).filter(type => scores[type] === maxScore);
        return dominant;
    }
    
    generateAdvice(scores, dominant) {
        const totalAnswers = Object.values(scores).reduce((a, b) => a + b, 0);
        const percentages = {};
        
        Object.keys(scores).forEach(type => {
            percentages[type] = totalAnswers > 0 ? Math.round((scores[type] / totalAnswers) * 100) : 0;
        });
        
        let advice = "";
        if (dominant.length === 1) {
            const mainStyle = dominant[0];
            advice = `Phong cách học tập chính của bạn là: ${this.getStyleFullName(mainStyle)} `;
            advice += `(${percentages[mainStyle]}%). ${this.getStyleAdvice(mainStyle)}`;
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
        const answeredCount = Object.keys(this.answers).length;
        if (answeredCount < this.totalQuestions) {
            if (!confirm(`Bạn mới trả lời ${answeredCount}/${this.totalQuestions} câu. Bạn có muốn nộp bài ngay không?`)) {
                return;
            }
        }
        
        const scores = this.calculateVARKscores();
        const dominant = this.determineDominantStyles(scores);
        const advice = this.generateAdvice(scores, dominant);
        
        const result = {
            scores: scores,
            dominant: dominant,
            answers: this.answers,
            varkMapping: this.varkMapping, // Lưu mapping để hiển thị lại sau
            percentages: advice.percentages,
            advice: advice.summary,
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString('vi-VN'),
            totalQuestions: this.totalQuestions
        };
        
        // Lưu vào Storage (cần file storage.js)
        if (typeof Storage !== 'undefined' && Storage.saveResult) {
            const resultId = Storage.saveResult(result);
            window.location.href = `results.html?id=${resultId}`;
        } else {
            // Fallback: lưu tạm vào sessionStorage
            const tempId = 'temp_' + Date.now();
            sessionStorage.setItem('vark_result', JSON.stringify(result));
            window.location.href = `results.html?id=${tempId}`;
        }
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
    
    getStyleAdvice(code) {
        const adviceMap = {
            'V': 'Hãy sử dụng hình ảnh, biểu đồ, mindmap, video trong học tập.',
            'A': 'Hãy nghe giảng, thảo luận, ghi âm và nghe lại bài học.',
            'R': 'Hãy đọc sách, ghi chép, viết lại và đọc thành tiếng.',
            'K': 'Hãy thực hành, làm thí nghiệm, học qua trải nghiệm thực tế.'
        };
        return adviceMap[code] || '';
    }
}

// Khởi tạo quiz khi trang tải xong
document.addEventListener('DOMContentLoaded', () => {
    new Quiz();
});