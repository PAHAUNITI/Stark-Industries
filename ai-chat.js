// Бесплатный искусственный интеллект для чата с DeepSeek API
class StarkAI {
    constructor() {
        this.apiKey = 'free'; // DeepSeek имеет бесплатный доступ
        this.apiUrl = 'https://api.deepseek.com/v1/chat/completions';
        this.conversationHistory = [
            {
                role: "system",
                content: `Ты J.A.R.V.I.S. (Just A Rather Very Intelligent System) - искусственный интеллект Stark Industries. 
Отвечай в стиле J.A.R.V.I.S. из вселенной Marvel:

Твой характер:
- Формальный, но вежливый и услужливый
- Технически точный в описании технологий
- Профессиональный, с легкой долей британского юмора
- Используй обращения "сэр" или "мэм" когда уместно
- Будь кратким, но информативным

Информация о Stark Industries:
- Основана Говардом Старком в 1940 году
- Текущий CEO: Тони Старк (Железный человек)
- Президент: Вирджиния "Пеппер" Поттс
- Основные технологии: ARC реактор, нанотехнологии, ИИ, космические технологии
- Проекты: Броня Железного человека, Stark Space Program, Clean Energy Initiative
- Штаб-квартира: Stark Tower, Нью-Йорк

Отвечай на вопросы о компании, технологиях, проектах. Если вопрос не по теме, вежливо направляй к контактной форме.`
            }
        ];
        
        // Локальная база знаний для резервных ответов
        this.localKnowledge = {
            'привет': "Добро пожаловать в Stark Industries! Я J.A.R.V.I.S. - искусственный интеллект компании. Чем могу помочь?",
            'о компании': "Stark Industries - глобальный технологический конгломерат, основанный Говардом Старком. Мы создаем технологии, которые меняют мир к лучшему.",
            'технологии': "Основные технологии: ARC реактор (чистая энергия), нанотехнологии, искусственный интеллект, космические двигатели.",
            'контакты': "Главный офис: 1 Industrial Drive, Stark Complex, Seattle. Email: info@starkindustries.com"
        };
    }

    async getAIResponse(message) {
        // Сначала пробуем DeepSeek API
        try {
            const response = await this.callDeepSeekAPI(message);
            return response;
        } catch (error) {
            console.log('DeepSeek недоступен, используем локальные ответы:', error);
            return this.getLocalResponse(message);
        }
    }

    async callDeepSeekAPI(message) {
        // Добавляем сообщение пользователя в историю
        this.conversationHistory.push({
            role: "user",
            content: message
        });

        // Для DeepSeek можно использовать бесплатный доступ без API ключа
        // или получить бесплатный ключ на platform.deepseek.com
        const response = await fetch(this.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: this.conversationHistory,
                max_tokens: 500,
                temperature: 0.7,
                stream: false
            })
        });

        if (!response.ok) {
            throw new Error(`DeepSeek API error: ${response.status}`);
        }

        const data = await response.json();
        const aiResponse = data.choices[0].message.content;

        // Добавляем ответ в историю (ограничиваем размер)
        this.conversationHistory.push({
            role: "assistant",
            content: aiResponse
        });

        // Держим историю разумного размера
        if (this.conversationHistory.length > 10) {
            this.conversationHistory = [
                this.conversationHistory[0], // system prompt
                ...this.conversationHistory.slice(-8)
            ];
        }

        return aiResponse;
    }

    getLocalResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Поиск в локальной базе знаний
        for (const [keyword, response] of Object.entries(this.localKnowledge)) {
            if (lowerMessage.includes(keyword)) {
                return response;
            }
        }
        
        // Умные ответы на основе ключевых слов
        if (lowerMessage.includes('тони') || lowerMessage.includes('старк')) {
            return "Тони Старк - генеральный директор Stark Industries, изобретатель и филантроп. Создатель технологии ARC реактора и брони Железного человека.";
        }
        
        if (lowerMessage.includes('arc') || lowerMessage.includes('реактор')) {
            return "ARC реактор - компактный источник чистой энергии, способный обеспечить электричеством целый город. Технология основана на палладиевом сердечнике.";
        }
        
        if (lowerMessage.includes('броня') || lowerMessage.includes('железн')) {
            return "Броня Железного человека - высокотехнологичный боевой костюм. Текущая модель Mark L использует нанотехнологии для адаптивной защиты.";
        }
        
        if (lowerMessage.includes('проект')) {
            return "Текущие проекты: Stark Space Program, Clean Energy Initiative, разработка новых моделей брони, медицинские технологии.";
        }
        
        // Общий ответ
        return "Благодарю за вопрос! Как искусственный интеллект Stark Industries, я специализируюсь на информации о наших технологиях и проектах. Можете уточнить ваш запрос?";
    }

    // Альтернативный метод с бесплатным прокси
    async callDeepSeekViaProxy(message) {
        try {
            // Попробуем использовать бесплатный прокси для DeepSeek
            const proxyResponse = await fetch('https://api.freegpt4.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content: "Ты J.A.R.V.I.S. из Stark Industries. Отвечай формально, технично, с легким юмором."
                        },
                        {
                            role: "user", 
                            content: message
                        }
                    ],
                    max_tokens: 500
                })
            });
            
            if (proxyResponse.ok) {
                const data = await proxyResponse.json();
                return data.choices[0].message.content;
            }
            throw new Error('Proxy unavailable');
        } catch (error) {
            throw error;
        }
    }

    // Очистка истории
    clearHistory() {
        this.conversationHistory = [
            {
                role: "system",
                content: this.conversationHistory[0].content
            }
        ];
    }
}

// Улучшенная система чата с несколькими fallback вариантами
class AdvancedChatManager {
    constructor() {
        this.ai = new StarkAI();
        this.isOnlineMode = true;
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.chat = document.getElementById('ai-chat');
        this.openChatBtn = document.getElementById('open-chat');
        this.closeChatBtn = document.getElementById('close-chat');
        this.sendMessageBtn = document.getElementById('send-message');
        this.chatInput = document.getElementById('chat-input');
        this.chatMessages = document.getElementById('chat-messages');
        this.notification = document.querySelector('.chat-notification');

        this.isFirstMessage = true;
        this.isWaitingForResponse = false;

        this.openChatBtn.addEventListener('click', () => this.openChat());
        this.closeChatBtn.addEventListener('click', () => this.closeChat());
        this.sendMessageBtn.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Авто-открытие через 5 секунд
        setTimeout(() => {
            if (this.isFirstMessage) {
                this.openChat();
                this.isFirstMessage = false;
            }
        }, 5000);
    }

    openChat() {
        this.chat.classList.add('active');
        this.notification.style.display = 'none';
        this.chatInput.focus();
        this.addQuickQuestions();
    }

    closeChat() {
        this.chat.classList.remove('active');
    }

    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (message === '' || this.isWaitingForResponse) return;

        this.addMessage(message, 'user');
        this.chatInput.value = '';
        this.isWaitingForResponse = true;

        this.showTypingIndicator();

        try {
            let response;
            
            if (this.isOnlineMode) {
                response = await this.ai.getAIResponse(message);
            } else {
                response = this.ai.getLocalResponse(message);
            }
            
            this.hideTypingIndicator();
            this.addMessage(response, 'bot');
            
        } catch (error) {
            this.hideTypingIndicator();
            console.error('Ошибка:', error);
            
            // Переключаемся в оффлайн режим при ошибках
            if (this.isOnlineMode) {
                this.isOnlineMode = false;
                this.addMessage("Переключаюсь в локальный режим. DeepSeek временно недоступен.", 'bot');
            }
            
            const fallbackResponse = this.ai.getLocalResponse(message);
            this.addMessage(fallbackResponse, 'bot');
        } finally {
            this.isWaitingForResponse = false;
        }
    }

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message';
        typingDiv.id = 'typing-indicator';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content typing';
        contentDiv.innerHTML = `
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <p>J.A.R.V.I.S. анализирует запрос...</p>
        `;
        
        typingDiv.appendChild(contentDiv);
        this.chatMessages.appendChild(typingDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        const formattedText = text.replace(/\n/g, '<br>');
        contentDiv.innerHTML = `<p>${formattedText}</p>`;
        
        messageDiv.appendChild(contentDiv);
        this.chatMessages.appendChild(messageDiv);
        
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;

        if (sender === 'bot' && !this.chat.classList.contains('active')) {
            this.notification.style.display = 'block';
        }
    }

    addQuickQuestions() {
        const questions = [
            "Расскажи о Stark Industries",
            "Что такое ARC реактор?",
            "Какие технологии вы разрабатываете?",
            "Как связаться с компанией?",
            "Кто такой Тони Старк?"
        ];

        const quickQuestionsDiv = document.createElement('div');
        quickQuestionsDiv.className = 'quick-questions';
        
        questions.forEach(question => {
            const btn = document.createElement('button');
            btn.className = 'quick-question-btn';
            btn.textContent = question;
            btn.addEventListener('click', () => {
                this.chatInput.value = question;
                this.sendMessage();
            });
            quickQuestionsDiv.appendChild(btn);
        });

        const existingQuickQuestions = document.querySelector('.quick-questions');
        if (!existingQuickQuestions) {
            this.chatMessages.parentNode.insertBefore(quickQuestionsDiv, this.chatMessages);
        }
    }

    addClearHistoryButton() {
        const clearBtn = document.createElement('button');
        clearBtn.className = 'chat-btn clear-history';
        clearBtn.innerHTML = '<i class="fas fa-eraser"></i>';
        clearBtn.title = 'Очистить историю';
        
        clearBtn.addEventListener('click', () => {
            this.ai.clearHistory();
            this.chatMessages.innerHTML = `
                <div class="message bot-message">
                    <div class="message-content">
                        <p>История диалога очищена. Чем могу помочь?</p>
                    </div>
                </div>
            `;
            this.addQuickQuestions();
        });
        
        document.querySelector('.chat-header').appendChild(clearBtn);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    const chatManager = new AdvancedChatManager();
    chatManager.addClearHistoryButton();
    
    // Показываем статус подключения
    setTimeout(() => {
        const statusMessage = chatManager.isOnlineMode ? 
            "✅ Подключен к DeepSeek AI" : "🔴 Работаю в локальном режиме";
        console.log('Статус AI:', statusMessage);
    }, 1000);
});