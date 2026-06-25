/**
 * Чистый Лист — Главный скрипт
 * Все функции: тема, каталог, фильтры, форма, PWA
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ============================================
    // 1. ТЕМА (светлая/тёмная) с localStorage
    // ============================================

    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    function getSavedTheme() {
        return localStorage.getItem('clean-sheet-theme') || 'light';
    }

    function applyTheme(theme) {
        if (theme === 'dark') {
            body.setAttribute('data-theme', 'dark');
            if (themeToggle) {
                themeToggle.innerHTML = '<span class="icon">☀️</span> Светлая';
            }
        } else {
            body.removeAttribute('data-theme');
            if (themeToggle) {
                themeToggle.innerHTML = '<span class="icon">🌙</span> Тёмная';
            }
        }
        localStorage.setItem('clean-sheet-theme', theme);
    }

    // Применяем сохранённую тему
    applyTheme(getSavedTheme());

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
            const next = current === 'dark' ? 'light' : 'dark';
            applyTheme(next);
        });
    }

    // ============================================
    // 2. КАТАЛОГ — товары, фильтры, "Показать ещё"
    // ============================================

    // ----- Данные товаров -----
    const products = [
        // Ручки
        { id: 1, title: 'Ручка "Акварель"', category: 'ручки', price: '2 450 ₽', desc: 'Корпус из алюминия, перо 18K' },
        { id: 2, title: 'Ручка "Классика"', category: 'ручки', price: '3 100 ₽', desc: 'Латунь, покрытие родием' },
        { id: 3, title: 'Ручка "Флора"', category: 'ручки', price: '2 780 ₽', desc: 'Деревянный корпус, перо из стали' },
        { id: 4, title: 'Ручка "Люкс"', category: 'ручки', price: '5 900 ₽', desc: 'Позолота, корпус из эбенового дерева' },
        // Блокноты
        { id: 5, title: 'Блокнот "Вдохновение"', category: 'блокноты', price: '1 890 ₽', desc: 'Бумага Tomoe River, обложка из кожи' },
        { id: 6, title: 'Блокнот "Терра"', category: 'блокноты', price: '2 240 ₽', desc: 'Обложка из пробки, бумага крафт' },
        { id: 7, title: 'Блокнот "Минималист"', category: 'блокноты', price: '1 450 ₽', desc: 'Идеальный для заметок, бумага 100 г/м²' },
        // Наборы
        { id: 8, title: 'Набор "Графика"', category: 'наборы', price: '5 600 ₽', desc: 'Лимитированная серия: 3 ручки + чернила' },
        { id: 9, title: 'Набор "Эксклюзив"', category: 'наборы', price: '8 900 ₽', desc: 'Ручка + блокнот + футляр из дерева' },
        // Аксессуары
        { id: 10, title: 'Подставка "Перо"', category: 'аксессуары', price: '890 ₽', desc: 'Из мрамора, для ручек и карандашей' },
        { id: 11, title: 'Закладка "Лента"', category: 'аксессуары', price: '540 ₽', desc: 'Шёлковая лента с гравировкой' },
        { id: 12, title: 'Чернила "Синяя лагуна"', category: 'аксессуары', price: '1 200 ₽', desc: 'Натуральные чернила ручной работы' },
    ];

    // ----- Состояние -----
    let currentFilter = 'all';
    let visibleCount = 6;
    const itemsPerLoad = 2;

    // ----- DOM -----
    const catalogGrid = document.getElementById('catalogGrid');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const catalogCount = document.getElementById('catalogCount');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // ----- Функция рендера -----
    function renderCatalog() {
        if (!catalogGrid) return;

        const filtered = currentFilter === 'all'
            ? products
            : products.filter(p => p.category === currentFilter);

        const shown = filtered.slice(0, visibleCount);

        // Обновляем счётчик
        if (catalogCount) {
            catalogCount.textContent = shown.length;
        }

        // Показываем/скрываем кнопку
        if (loadMoreBtn) {
            if (visibleCount >= filtered.length) {
                loadMoreBtn.style.display = 'none';
            } else {
                loadMoreBtn.style.display = 'inline-flex';
                const remaining = filtered.length - visibleCount;
                loadMoreBtn.textContent = `Показать ещё (${Math.min(itemsPerLoad, remaining)})`;
            }
        }

        // Рендерим карточки
        catalogGrid.innerHTML = '';
        shown.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card fade-up';
            card.innerHTML = `
                <div class="product-image">
                    <span class="category-tag">${product.category}</span>
                    <div class="placeholder">
                        <span>📎</span>
                        <span>Фото</span>
                    </div>
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <p class="product-desc">${product.desc}</p>
                    <div class="product-price">${product.price}</div>
                    <button class="btn btn-primary btn-small add-to-cart" data-id="${product.id}">
                        В корзину
                    </button>
                </div>
            `;
            catalogGrid.appendChild(card);
        });

        // Обработчики для кнопок "В корзину"
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.dataset.id);
                const product = products.find(p => p.id === id);
                if (product) {
                    console.log('🛒 Добавлен в корзину:', product.title);
                    this.textContent = '✅ Добавлено';
                    this.style.opacity = '0.7';
                    setTimeout(() => {
                        this.textContent = 'В корзину';
                        this.style.opacity = '1';
                    }, 1500);
                }
            });
        });
    }

    // ----- Фильтры -----
    if (filterBtns.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentFilter = this.dataset.filter;
                visibleCount = 6;
                renderCatalog();
                // Прокрутка к каталогу
                catalogGrid?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    }

    // ----- "Показать ещё" -----
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            const filtered = currentFilter === 'all'
                ? products
                : products.filter(p => p.category === currentFilter);
            visibleCount = Math.min(visibleCount + itemsPerLoad, filtered.length);
            renderCatalog();
        });
    }

    // ----- Инициализация каталога -----
    if (catalogGrid) {
        renderCatalog();
    }

    // ============================================
    // 3. ФОРМА ОБРАТНОЙ СВЯЗИ (валидация + console.log)
    // ============================================

    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        const nameError = document.getElementById('nameError');
        const emailError = document.getElementById('emailError');
        const messageError = document.getElementById('messageError');
        const successMessage = document.getElementById('successMessage');

        // Валидация в реальном времени
        function validateField(input, errorEl, validator) {
            input.addEventListener('input', () => {
                const isValid = validator(input.value);
                if (!isValid && input.value.trim() !== '') {
                    errorEl.classList.add('show');
                    input.classList.add('error');
                } else {
                    errorEl.classList.remove('show');
                    input.classList.remove('error');
                }
            });

            input.addEventListener('blur', () => {
                const isValid = validator(input.value);
                if (!isValid && input.value.trim() !== '') {
                    errorEl.classList.add('show');
                    input.classList.add('error');
                } else {
                    errorEl.classList.remove('show');
                    input.classList.remove('error');
                }
            });
        }

        // Валидаторы
        const validators = {
            name: (val) => val.trim().length >= 2,
            email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()),
            message: (val) => val.trim().length >= 5
        };

        if (nameInput && nameError) {
            validateField(nameInput, nameError, validators.name);
        }
        if (emailInput && emailError) {
            validateField(emailInput, emailError, validators.email);
        }
        if (messageInput && messageError) {
            validateField(messageInput, messageError, validators.message);
        }

        // Отправка формы
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = nameInput ? nameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const message = messageInput ? messageInput.value.trim() : '';

            let isValid = true;

            // Проверяем все поля
            if (!validators.name(name)) {
                if (nameError) nameError.classList.add('show');
                if (nameInput) nameInput.classList.add('error');
                isValid = false;
            } else {
                if (nameError) nameError.classList.remove('show');
                if (nameInput) nameInput.classList.remove('error');
            }

            if (!validators.email(email)) {
                if (emailError) emailError.classList.add('show');
                if (emailInput) emailInput.classList.add('error');
                isValid = false;
            } else {
                if (emailError) emailError.classList.remove('show');
                if (emailInput) emailInput.classList.remove('error');
            }

            if (!validators.message(message)) {
                if (messageError) messageError.classList.add('show');
                if (messageInput) messageInput.classList.add('error');
                isValid = false;
            } else {
                if (messageError) messageError.classList.remove('show');
                if (messageInput) messageInput.classList.remove('error');
            }

            if (!isValid) return;

            // ✅ Всё валидно — выводим в консоль
            const formData = { name, email, message };
            console.log('📨 Данные формы (Чистый Лист):', formData);

            // Показываем успех
            if (successMessage) {
                successMessage.classList.add('show');
                successMessage.textContent = '✅ Спасибо! Мы свяжемся с вами в ближайшее время.';
            }

            // Сбрасываем форму
            contactForm.reset();

            // Скрываем уведомление через 5 секунд
            setTimeout(() => {
                if (successMessage) {
                    successMessage.classList.remove('show');
                }
            }, 5000);
        });
    }

    // ============================================
    // 4. PWA — РЕГИСТРАЦИЯ SERVICE WORKER
    // ============================================

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then((registration) => {
                    console.log('✅ Service Worker зарегистрирован:', registration.scope);
                })
                .catch((error) => {
                    console.log('❌ Ошибка регистрации SW:', error);
                });
        });
    }

    // ============================================
    // 5. FALLBACK ДЛЯ ИЗОБРАЖЕНИЙ
    // ============================================

    document.addEventListener('error', (e) => {
        const target = e.target;
        if (target.tagName === 'IMG') {
            target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"%3E%3Crect fill="%23dce7f2" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" font-family="sans-serif" font-size="16" fill="%236a7f94" text-anchor="middle" dy=".3em"%3E📎 фото%3C/text%3E%3C/svg%3E';
        }
    }, true);

    // ============================================
    // 6. АКТИВНАЯ ССЫЛКА В НАВИГАЦИИ
    // ============================================

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });

    console.log('🌸 Чистый Лист — сайт запущен');
});