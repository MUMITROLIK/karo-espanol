// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const sunIcon = document.querySelector('.sun-icon');
const moonIcon = document.querySelector('.moon-icon');

const savedTheme = localStorage.getItem('theme') || 'light';
body.className = `${savedTheme}-theme`;
updateThemeIcons(savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = body.classList.contains('light-theme') ? 'light' : 'dark';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    body.className = `${newTheme}-theme`;
    localStorage.setItem('theme', newTheme);
    updateThemeIcons(newTheme);
});

function updateThemeIcons(theme) {
    if (theme === 'dark') {
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    } else {
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    }
}

// Lesson Data - Sample questions
const lessons = {
    '1': {
        title: 'Приветствия',
        titleEs: 'Saludos',
        questions: [
            {
                question: 'Как сказать "Привет" по-испански?',
                hint: 'Выберите правильный ответ',
                answers: ['Hola', 'Adiós', 'Gracias', 'Por favor'],
                correct: 0
            },
            {
                question: 'Как ответить на "¿Cómo estás?"',
                hint: 'Это значит "Как дела?"',
                answers: ['Bien, gracias', 'Hola', 'Me llamo', 'Adiós'],
                correct: 0
            },
            {
                question: 'Что означает "Buenos días"?',
                hint: 'Это приветствие',
                answers: ['Доброе утро', 'Спокойной ночи', 'До свидания', 'Привет'],
                correct: 0
            },
            {
                question: 'Как сказать "До свидания"?',
                hint: 'Прощальная фраза',
                answers: ['Adiós', 'Hola', 'Gracias', 'Por favor'],
                correct: 0
            },
            {
                question: 'Что значит "¿Qué tal?"',
                hint: 'Неформальное приветствие',
                answers: ['Как дела?', 'Спасибо', 'Пожалуйста', 'Привет'],
                correct: 0
            },
            {
                question: 'Как представиться по-испански?',
                hint: 'Сказать своё имя',
                answers: ['Me llamo...', 'Hola', 'Adiós', 'Gracias'],
                correct: 0
            },
            {
                question: 'Что означает "Mucho gusto"?',
                hint: 'Говорят при знакомстве',
                answers: ['Приятно познакомиться', 'До встречи', 'Спасибо', 'Извините'],
                correct: 0
            },
            {
                question: 'Как сказать "Спокойной ночи"?',
                hint: 'Пожелание перед сном',
                answers: ['Buenas noches', 'Buenos días', 'Buenas tardes', 'Hola'],
                correct: 0
            },
            {
                question: 'Что значит "Hasta luego"?',
                hint: 'Прощальная фраза',
                answers: ['До скорого', 'Привет', 'Спасибо', 'Пожалуйста'],
                correct: 0
            },
            {
                question: 'Как сказать "Добрый день"?',
                hint: 'Дневное приветствие',
                answers: ['Buenas tardes', 'Buenos días', 'Buenas noches', 'Hola'],
                correct: 0
            }
        ]
    },
    '2': {
        title: 'Закажите кофе',
        titleEs: 'Pide un café',
        questions: [
            {
                question: 'Как попросить кофе по-испански?',
                hint: 'Выберите правильный ответ',
                answers: ['Un café, por favor', 'Una mesa', 'La cuenta', 'El menú'],
                correct: 0
            },
            {
                question: 'Что означает "con leche"?',
                hint: 'Добавка к кофе',
                answers: ['С молоком', 'С сахаром', 'Чёрный', 'Холодный'],
                correct: 0
            }
            // Add more questions...
        ]
    }
    // Add more lessons...
};

// Lesson State
let currentLessonId = localStorage.getItem('currentLesson') || '1';
let currentLesson = lessons[currentLessonId];
let currentQuestionIndex = 0;
let streak = 0;
let answeredCorrectly = false;

// Elements
const questionText = document.getElementById('questionText');
const questionHint = document.getElementById('questionHint');
const answerOptions = document.getElementById('answerOptions');
const nextBtn = document.getElementById('nextBtn');
const progressLabel = document.getElementById('progressLabel');
const progressFill = document.getElementById('lessonProgressFill');
const streakCount = document.getElementById('streakCount');
const karoPopup = document.getElementById('karoPopup');
const karoMessage = document.getElementById('karoMessage');
const karoClose = document.getElementById('karoClose');

// Initialize lesson
function initLesson() {
    if (!currentLesson) {
        alert('Урок не найден');
        window.location.href = 'index.html';
        return;
    }
    
    loadQuestion();
}

// Load current question
function loadQuestion() {
    if (currentQuestionIndex >= currentLesson.questions.length) {
        completeLesson();
        return;
    }
    
    const question = currentLesson.questions[currentQuestionIndex];
    answeredCorrectly = false;
    
    // Update question
    questionText.textContent = question.question;
    questionHint.textContent = question.hint;
    
    // Update progress
    const progress = ((currentQuestionIndex + 1) / currentLesson.questions.length) * 100;
    progressFill.style.width = `${progress}%`;
    progressLabel.textContent = `Вопрос ${currentQuestionIndex + 1} из ${currentLesson.questions.length}`;
    
    // Clear and create answer buttons
    answerOptions.innerHTML = '';
    question.answers.forEach((answer, index) => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.textContent = answer;
        btn.onclick = () => checkAnswer(index, question.correct);
        answerOptions.appendChild(btn);
    });
    
    // Hide next button
    nextBtn.classList.remove('show');
}

// Check answer
function checkAnswer(selected, correct) {
    if (answeredCorrectly) return; // Prevent multiple clicks
    
    answeredCorrectly = true;
    const buttons = document.querySelectorAll('.answer-btn');
    
    if (selected === correct) {
        // Correct answer
        buttons[selected].classList.add('correct');
        streak++;
        streakCount.textContent = streak;
        
        // Show Karo popup at 5, 10, 15... streak
        if (streak === 5) {
            showKaro('¡Genial! 5 правильных ответов подряд! 🎉');
        } else if (streak === 10) {
            showKaro('¡Increíble! 10 ответов подряд! Ты просто супер! 🔥');
        } else if (streak > 10 && streak % 5 === 0) {
            showKaro(`¡Fantástico! ${streak} ответов подряд! Каро гордится тобой! 🌟`);
        }
    } else {
        // Wrong answer
        buttons[selected].classList.add('wrong');
        buttons[correct].classList.add('correct');
        streak = 0;
        streakCount.textContent = streak;
    }
    
    // Disable all buttons
    buttons.forEach(btn => btn.onclick = null);
    
    // Show next button
    setTimeout(() => {
        nextBtn.classList.add('show');
    }, 500);
}

// Next question
nextBtn.onclick = () => {
    currentQuestionIndex++;
    loadQuestion();
};

// Complete lesson
function completeLesson() {
    // Save progress
    const progress = JSON.parse(localStorage.getItem('lessonProgress') || '{}');
    progress[currentLessonId] = {
        completed: currentLesson.questions.length,
        total: currentLesson.questions.length
    };
    localStorage.setItem('lessonProgress', JSON.stringify(progress));
    
    // Show completion message
    questionText.textContent = '¡Felicidades! Урок завершён! 🎉';
    questionHint.textContent = `Ты ответил правильно на все вопросы!`;
    answerOptions.innerHTML = '';
    
    nextBtn.textContent = 'Вернуться к урокам';
    nextBtn.classList.add('show');
    nextBtn.onclick = () => {
        window.location.href = 'index.html';
    };
    
    // Show final Karo popup
    setTimeout(() => {
        showKaro('¡Excelente trabajo! Ты завершил урок! Каро очень рад! 🎊');
    }, 500);
}

// Karo popup functions
function showKaro(message) {
    karoMessage.textContent = message;
    karoPopup.classList.remove('hidden');
}

karoClose.onclick = () => {
    karoPopup.classList.add('hidden');
};

// Close popup on background click
karoPopup.onclick = (e) => {
    if (e.target === karoPopup) {
        karoPopup.classList.add('hidden');
    }
};

// Initialize
initLesson();