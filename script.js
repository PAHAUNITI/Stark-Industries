// Плавная прокрутка к якорям
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
        });
    });
});

// Анимация появления элементов при скролле
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Наблюдаем за элементами, которые должны появляться при скролле
document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Управление 3D реактором
const reactor3d = document.getElementById('reactor3d');
const iframe = reactor3d.querySelector('iframe');
const rotateBtn = document.getElementById('rotateBtn');
const resetBtn = document.getElementById('resetBtn');

let isRotating = true;

// Функция для обновления параметров iframe
function updateIframeParams(params) {
    const currentSrc = iframe.src.split('?')[0];
    iframe.src = currentSrc + '?' + params;
}

// Управление вращением
rotateBtn.addEventListener('click', function() {
    isRotating = !isRotating;
    
    if (isRotating) {
        updateIframeParams('autospin=1&autostart=1&ui_controls=1&ui_infos=1&ui_stop=1&ui_theatre=1&ui_watermark=0&ui_watermark_link=0');
        this.textContent = 'Остановить вращение';
    } else {
        updateIframeParams('autospin=0&autostart=0&ui_controls=1&ui_infos=1&ui_stop=1&ui_theatre=1&ui_watermark=0&ui_watermark_link=0');
        this.textContent = 'Вращение';
    }
});

// Сброс модели
resetBtn.addEventListener('click', function() {
    updateIframeParams('autospin=1&autostart=1&ui_controls=1&ui_infos=1&ui_stop=1&ui_theatre=1&ui_watermark=0&ui_watermark_link=0');
    isRotating = true;
    rotateBtn.textContent = 'Остановить вращение';
});

// Эффект параллакса для героя
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
    }
});

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Скрываем прелоадер после загрузки страницы
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    }, 2000);
    
    // Проверяем видимость элементов при загрузке
    const checkVisibility = () => {
        document.querySelectorAll('.fade-in').forEach(el => {
            const rect = el.getBoundingClientRect();
            const isVisible = (
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
                rect.bottom >= 0
            );
            
            if (isVisible) {
                el.classList.add('visible');
            }
        });
    };
    
    // Проверяем видимость при загрузке и скролле
    checkVisibility();
    window.addEventListener('scroll', checkVisibility);
});