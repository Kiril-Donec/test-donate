document.addEventListener('DOMContentLoaded', () => {
    // Переключение валют
    const currencySelector = document.querySelector('.currency-selector');
    const selectedCurrency = document.querySelector('.selected-currency');
    const currencyOptions = document.querySelectorAll('.currency-option');
    const currencyLabel = document.querySelector('.currency-label');
    
    let currentCurrency = 'RUB';

    selectedCurrency.addEventListener('click', () => {
        currencySelector.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!currencySelector.contains(e.target)) {
            currencySelector.classList.remove('active');
        }
    });

    currencyOptions.forEach(option => {
        option.addEventListener('click', () => {
            const newCurrency = option.dataset.currency;
            const currencyIcon = option.querySelector('.currency-icon').textContent;
            const currencyName = option.querySelector('.currency-name').textContent;

            selectedCurrency.querySelector('.currency-icon').textContent = currencyIcon;
            selectedCurrency.querySelector('.currency-name').textContent = currencyName;
            currencySelector.classList.remove('active');

            currentCurrency = newCurrency;
            updatePrices();
        });
    });

    function updatePrices() {
        // Обновляем цены для карточек привилегий
        const donationCards = document.querySelectorAll('.donation-card');
        donationCards.forEach(card => {
            const rubPrice = card.querySelector('.rub-price');
            const uahPrice = card.querySelector('.uah-price');
            
            if (rubPrice && uahPrice) {
                if (currentCurrency === 'RUB') {
                    uahPrice.classList.remove('active');
                    setTimeout(() => {
                        rubPrice.classList.add('active');
                    }, 150);
                } else {
                    rubPrice.classList.remove('active');
                    setTimeout(() => {
                        uahPrice.classList.add('active');
                    }, 150);
                }
            }
        });

        // Обновляем цены для кейсов
        const caseCards = document.querySelectorAll('.case-card');
        caseCards.forEach(card => {
            const priceElement = card.querySelector('.case-price .amount');
            if (priceElement) {
                const rubPrice = card.dataset.price + '₽';
                const uahPrice = '16.5₴';
                priceElement.textContent = currentCurrency === 'RUB' ? rubPrice : uahPrice;
            }
        });
    }

    // Активируем рублевые цены сразу после определения функции
    updatePrices();

    // Переключение вкладок
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    function switchTab(targetTabId) {
        // Удаляем класс active у всех кнопок
        tabButtons.forEach(btn => btn.classList.remove('active'));
        
        // Добавляем класс active нужной кнопке
        const targetButton = document.querySelector(`[data-tab="${targetTabId}"]`);
        if (targetButton) {
            targetButton.classList.add('active');
        }

        // Скрываем все вкладки
        tabContents.forEach(content => {
            content.style.display = 'none';
            content.classList.remove('active');
        });

        // Показываем нужную вкладку
        const targetContent = document.getElementById(targetTabId);
        if (targetContent) {
            targetContent.style.display = 'block';
            setTimeout(() => {
                targetContent.classList.add('active');
                targetContent.style.opacity = '1';
                targetContent.style.transform = 'translateY(0) scale(1)';
            }, 10);
        }
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;
            switchTab(tabId);
        });
    });

    // Модальное окно оплаты
    const modal = document.getElementById('paymentModal');
    const closeBtn = document.querySelector('.close');
    const privilegeTitle = document.getElementById('privilegeTitle');
    const paymentAmount = document.getElementById('paymentAmount');
    const paymentMethods = document.querySelectorAll('.payment-method');
    const cardDetails = document.querySelector('.card-details');
    const qrDetails = document.querySelector('.qr-details');

    window.showPayment = (privilege, amount) => {
        console.log('Вызвана функция showPayment с привилегией:', privilege, 'и суммой:', amount); // Отладочное сообщение
        privilegeTitle.textContent = privilege;
        
        // Находим цену в зависимости от типа карточки
        let rubPrice, uahPrice;
        
        if (privilege === 'Кейс с донатом') {
            const caseCard = document.querySelector('.case-card');
            rubPrice = caseCard.querySelector('.case-price .amount').textContent;
            uahPrice = amount + '₴';
        } else {
            const cards = document.querySelectorAll('.donation-card');
            const card = Array.from(cards).find(card => 
                card.querySelector('.donation-title').textContent === privilege
            );
            rubPrice = card.querySelector('.rub-price').textContent;
            uahPrice = card.querySelector('.uah-price').textContent;
        }
        
        paymentAmount.textContent = currentCurrency === 'RUB' ? rubPrice.replace('₽', '') : uahPrice.replace('₴', '');
        currencyLabel.textContent = currentCurrency === 'RUB' ? '₽' : '₴';
        
        modal.style.display = 'block';
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.querySelector('.modal-content').style.transform = 'translateY(0)';
        }, 10);
    };

    paymentMethods.forEach(method => {
        method.addEventListener('click', () => {
            paymentMethods.forEach(m => m.classList.remove('active'));
            method.classList.add('active');

            if (method.dataset.method === 'card') {
                cardDetails.classList.add('active');
                qrDetails.classList.remove('active');
            } else {
                qrDetails.classList.add('active');
                cardDetails.classList.remove('active');
            }
        });
    });

    closeBtn.onclick = () => {
        modal.style.opacity = '0';
        modal.querySelector('.modal-content').style.transform = 'translateY(-20px)';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    };

    window.onclick = (event) => {
        if (event.target == modal) {
            closeBtn.onclick();
        }
    };

    window.copyCard = () => {
        const cardNumber = document.querySelector('.card-number').textContent;
        navigator.clipboard.writeText(cardNumber).then(() => {
            const copyButton = document.querySelector('.copy-card-button');
            const originalText = copyButton.innerHTML;
            copyButton.innerHTML = '<span class="button-icon">✓</span>Скопировано!';
            setTimeout(() => {
                copyButton.innerHTML = originalText;
            }, 2000);
        });
    };

    window.confirmPayment = () => {
        const nickname = prompt('Введите ваш никнейм в игре:');
        if (nickname) {
            alert(`Спасибо за оплату! Мы проверим платеж и выдадим привилегию на никнейм ${nickname} в течение 5 минут.`);
            closeBtn.onclick();
        }
    };

    // Добавляем эффект при наведении на карточки
    const cards = document.querySelectorAll('.donation-card, .case-card');
    cards.forEach(card => {
        card.addEventListener('mouseover', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseout', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Добавляем вспомогательную функцию для поиска по содержимому
    jQuery.expr[':'].contains = function(a, i, m) {
        return jQuery(a).text().toUpperCase()
            .indexOf(m[3].toUpperCase()) >= 0;
    };

    // Обработка формы входа
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Предотвращаем перезагрузку страницы
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Отправляем запрос на сервер для проверки учетных данных
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        const loginMessage = document.getElementById('loginMessage');

        if (data.success) {
            loginMessage.textContent = 'Успешный вход!';
            // Здесь можно добавить логику для обновления интерфейса
        } else {
            loginMessage.textContent = 'Неверный ник или пароль.';
        }
    });

    // Обработка кнопки входа
    const openLoginFormButton = document.getElementById('openLoginForm');
    const loginContainer = document.querySelector('.login-container');

    openLoginFormButton.addEventListener('click', () => {
        loginContainer.style.display = loginContainer.style.display === 'block' ? 'none' : 'block';
    });
}); 