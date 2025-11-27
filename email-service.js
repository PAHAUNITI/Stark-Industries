// Сервис для отправки email через Web3Forms
class EmailService {
    constructor() {
        this.web3formsKey = '2b38bf6c-9264-4f6b-a273-d4a7864ffc25'; // Замените на ваш ключ
        this.contactForm = document.getElementById('contactForm');
        this.init();
    }

    init() {
        if (this.contactForm) {
            this.contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit();
            });
        }
    }

    async handleFormSubmit() {
        const formData = this.getFormData();
        
        if (this.validateForm(formData)) {
            await this.sendViaWeb3Forms(formData);
        } else {
            this.showValidationError();
        }
    }

    getFormData() {
        return {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            subject: document.getElementById('subject').value.trim(),
            message: document.getElementById('message').value.trim(),
            timestamp: new Date().toLocaleString('ru-RU')
        };
    }

    validateForm(data) {
        let isValid = true;
        const fields = ['name', 'email', 'subject', 'message'];
        
        // Сброс стилей ошибок
        fields.forEach(field => {
            const element = document.getElementById(field);
            element.style.borderColor = '#333';
        });

        // Проверка заполнения полей
        fields.forEach(field => {
            if (!data[field]) {
                document.getElementById(field).style.borderColor = '#ff4757';
                isValid = false;
            }
        });

        // Валидация email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (data.email && !emailRegex.test(data.email)) {
            document.getElementById('email').style.borderColor = '#ff4757';
            isValid = false;
        }

        return isValid;
    }

    async sendViaWeb3Forms(formData) {
        const submitBtn = this.contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Показываем загрузку
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
        submitBtn.disabled = true;

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    access_key: this.web3formsKey,
                    subject: `Stark Industries: ${formData.subject}`,
                    from_name: formData.name,
                    email: formData.email,
                    message: this.formatMessage(formData),
                    botcheck: '' // Anti-bot protection
                })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                this.showSuccessMessage();
                this.contactForm.reset();
            } else {
                throw new Error(result.message || 'Ошибка отправки');
            }

        } catch (error) {
            console.error('Ошибка Web3Forms:', error);
            this.showErrorMessage(error.message);
        } finally {
            // Восстанавливаем кнопку
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    formatMessage(formData) {
        return `
📧 НОВОЕ СООБЩЕНИЕ С САЙТA STARK INDUSTRIES

👤 Имя: ${formData.name}
📧 Email: ${formData.email}
🎯 Тема: ${formData.subject}
⏰ Время отправки: ${formData.timestamp}

💬 Сообщение:
${formData.message}

---
Отправлено через Web3Forms • Stark Industries Contact Form
        `.trim();
    }

    showSuccessMessage() {
        this.showMessage(`
            ✅ <strong>Сообщение отправлено!</strong><br>
            Мы свяжемся с вами в ближайшее время. Спасибо за обращение в Stark Industries!
        `, 'success');
    }

    showErrorMessage(details = '') {
        const message = `
            ❌ <strong>Ошибка отправки</strong><br>
            Пожалуйста, попробуйте еще раз или свяжитесь с нами напрямую.
            ${details ? `<br><small>${details}</small>` : ''}
        `;
        this.showMessage(message, 'error');
    }

    showValidationError() {
        this.showMessage(`
            ⚠️ <strong>Пожалуйста, заполните все поля корректно</strong><br>
            Проверьте правильность email адреса и заполнение всех обязательных полей.
        `, 'error');
    }

    showMessage(html, type) {
        // Удаляем существующие уведомления
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Создаем элемент уведомления
        const messageDiv = document.createElement('div');
        messageDiv.className = `notification ${type}`;
        messageDiv.innerHTML = `
            <div class="notification-content">
                ${html}
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        document.body.appendChild(messageDiv);

        // Автоматическое скрытие
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => {
                    if (messageDiv.parentNode) {
                        messageDiv.parentNode.removeChild(messageDiv);
                    }
                }, 300);
            }
        }, type === 'success' ? 8000 : 6000);
    }
}

// Инициализация сервиса при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    new EmailService();
});