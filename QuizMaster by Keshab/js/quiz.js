class Quiz {
    constructor() {
        this.questions = [];
        this.currentQuestion = 0;
        this.score = 0;
        this.timer = null;
        this.timeLeft = 30;
        this.category = '';
        this.startTime = null;
        this.totalTimeTaken = 0;
        this.loadingMessage = null;
        
        // Category mapping for Open Trivia DB
        this.categoryMapping = {
            'Science': 17,
            'Math': 19,
            'Programming': 18,
            'General Knowledge': 9
        };
        
        // DOM Elements
        this.questionElement = document.getElementById('question');
        this.optionsElement = document.getElementById('options');
        this.nextButton = document.getElementById('nextBtn');
        this.timerElement = document.getElementById('timer');
        this.timeProgress = document.getElementById('timeProgress');
        this.questionNumber = document.getElementById('questionNumber');
        this.quizProgress = document.getElementById('quizProgress');
        this.homeSection = document.getElementById('homeSection');

        // Initialize event listeners
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Add click event listeners to category cards
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const category = card.getAttribute('data-category-name');
                if (category) {
                    this.loadQuestions(category);
                }
            });
        });

        // Next button event listener
        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => this.handleNextQuestion());
        }
    }

    showLoadingMessage() {
        // Remove any existing loading message
        this.removeLoadingMessage();
        
        // Create new loading message
        this.loadingMessage = document.createElement('div');
        this.loadingMessage.className = 'alert loading-alert';
        this.loadingMessage.textContent = 'Loading questions...';
        this.homeSection.appendChild(this.loadingMessage);
    }

    removeLoadingMessage() {
        // Remove any existing loading messages
        const existingAlerts = document.querySelectorAll('.loading-alert');
        existingAlerts.forEach(alert => alert.remove());
        if (this.loadingMessage) {
            this.loadingMessage.remove();
            this.loadingMessage = null;
        }
    }

    async loadQuestions(category) {
        this.category = category;
        try {
            const categoryId = this.categoryMapping[category];
            if (!categoryId) {
                throw new Error(`Invalid category: ${category}`);
            }

            // Show loading message
            this.showLoadingMessage();

            // Fetch from API
            const response = await fetch(`https://opentdb.com/api.php?amount=10&category=${categoryId}&type=multiple`);
            if (!response.ok) {
                throw new Error('Failed to fetch questions');
            }

            const data = await response.json();
            
            if (data.response_code !== 0 || !data.results || data.results.length === 0) {
                throw new Error('No questions available for this category');
            }

            // Process questions
            this.questions = data.results.map(q => ({
                question: this.decodeHtml(q.question),
                options: [...q.incorrect_answers, q.correct_answer]
                    .map(option => this.decodeHtml(option))
                    .sort(() => Math.random() - 0.5),
                correct: this.decodeHtml(q.correct_answer)
            }));

            // Remove loading message before starting quiz
            this.removeLoadingMessage();
            this.startQuiz();
        } catch (error) {
            console.error('Error loading questions:', error);
            this.removeLoadingMessage();
            const errorAlert = document.createElement('div');
            errorAlert.className = 'alert error-alert';
            errorAlert.textContent = 'Error loading questions. Please try again.';
            this.homeSection.appendChild(errorAlert);
            setTimeout(() => errorAlert.remove(), 3000);
        }
    }

    // Helper function to decode HTML entities
    decodeHtml(html) {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    }

    startQuiz() {
        this.currentQuestion = 0;
        this.score = 0;
        this.startTime = new Date();
        this.showQuestion();
        this.updateQuizProgress();
        this.showSection('quizSection');
    }

    showQuestion() {
        const question = this.questions[this.currentQuestion];
        this.questionNumber.textContent = `Question ${this.currentQuestion + 1}/${this.questions.length}`;
        this.questionElement.textContent = question.question;
        
        // Clear previous options
        this.optionsElement.innerHTML = '';
        
        // Add new options
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option';
            button.textContent = option;
            button.addEventListener('click', () => this.selectOption(button, index));
            this.optionsElement.appendChild(button);
        });

        // Reset timer
        this.resetTimer();
        this.nextButton.disabled = true;
        this.updateQuizProgress();
    }

    selectOption(button, index) {
        // Clear previous selection
        const options = this.optionsElement.querySelectorAll('.option');
        options.forEach(opt => opt.classList.remove('selected'));
        
        // Add selection to clicked option
        button.classList.add('selected');
        
        // Enable next button
        this.nextButton.disabled = false;
        
        // Store selected answer
        this.selectedAnswer = this.questions[this.currentQuestion].options[index];
    }

    resetTimer() {
        clearInterval(this.timer);
        this.timeLeft = 30;
        this.updateTimer();
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimer();
            
            if (this.timeLeft === 0) {
                clearInterval(this.timer);
                this.handleNextQuestion();
            }
        }, 1000);
    }

    updateTimer() {
        this.timerElement.textContent = `${this.timeLeft}s`;
        const progress = (this.timeLeft / 30) * 100;
        this.timeProgress.style.width = `${progress}%`;
    }

    async handleNextQuestion() {
        clearInterval(this.timer);
        
        if (this.selectedAnswer === this.questions[this.currentQuestion].correct) {
            this.score++;
        }
        
        this.currentQuestion++;
        
        if (this.currentQuestion < this.questions.length) {
            this.showQuestion();
        } else {
            await this.endQuiz();
        }
    }

    updateQuizProgress() {
        const progress = ((this.currentQuestion + 1) / this.questions.length) * 100;
        this.quizProgress.style.width = `${progress}%`;
        
        // Update the progress text
        document.getElementById('progressText').textContent = 
            `${this.currentQuestion + 1} of ${this.questions.length} questions`;
    }

    async endQuiz() {
        // Calculate total time taken
        const endTime = new Date();
        this.totalTimeTaken = Math.floor((endTime - this.startTime) / 1000); // in seconds
        
        // Format time for display
        const minutes = Math.floor(this.totalTimeTaken / 60);
        const seconds = this.totalTimeTaken % 60;
        const formattedTime = `${minutes}m ${seconds}s`;

        // Calculate percentage and get compliment
        const percentage = (this.score / this.questions.length) * 100;
        const compliment = this.getCompliment(percentage);

        // Show results with compliment
        document.getElementById('scoreValue').textContent = this.score;
        document.getElementById('correctAnswers').textContent = `${this.score}/${this.questions.length}`;
        document.getElementById('timeTaken').textContent = formattedTime;
        
        // Add compliment
        const complimentElement = document.getElementById('compliment');
        complimentElement.textContent = compliment.text;
        complimentElement.className = `compliment ${compliment.class}`;
        
        this.showSection('resultsSection');
    }

    getCompliment(percentage) {
        if (percentage === 100) {
            return {
                text: "Perfect! You're a Quiz Master! ",
                class: 'perfect'
            };
        } else if (percentage >= 80) {
            return {
                text: "Excellent Work! You're Brilliant! ",
                class: 'excellent'
            };
        } else if (percentage >= 60) {
            return {
                text: "Good Job! Keep it Up! ",
                class: 'good'
            };
        } else {
            return {
                text: "Nice Try! Practice Makes Perfect! ",
                class: 'fair'
            };
        }
    }

    showSection(sectionId) {
        // Remove any existing loading or error messages when changing sections
        this.removeLoadingMessage();
        
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show the requested section
        document.getElementById(sectionId).classList.add('active');
    }

    // Initialize quiz
    async init() {
        const user = auth.currentUser;
        if (user) {
            try {
                const scoresRef = db.collection('scores').where('userId', '==', user.uid);
                const scores = await scoresRef.get();
                if (scores.docs.length > 0) {
                    const latestScore = scores.docs[0].data();
                    this.category = latestScore.category;
                    this.questions = latestScore.questions;
                    this.startQuiz();
                } else {
                    this.loadQuestions('General Knowledge');
                }
            } catch (error) {
                console.error('Error loading scores:', error);
                this.loadQuestions('General Knowledge');
            }
        } else {
            this.loadQuestions('General Knowledge');
        }
    }
}

// Initialize quiz without auto-loading questions
const quiz = new Quiz();
