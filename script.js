document.addEventListener('DOMContentLoaded', () => {
    // Переключение вкладок
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    function switchTab(targetTabId) {
        // Находим активную вкладку
        const activeContent = document.querySelector('.tab-content.active');
        const targetContent = document.getElementById(targetTabId);

        // Убираем активный класс со всех кнопок
        tabButtons.forEach(btn => btn.classList.remove('active'));
        
        // Активируем нужную кнопку
        const targetButton = document.querySelector(`[data-tab="${targetTabId}"]`);
        targetButton.classList.add('active');

        // Если есть активная вкладка, анимируем её исчезновение
        if (activeContent) {
            activeContent.style.opacity = '0';
            activeContent.style.transform = 'translateY(20px) scale(0.95)';
            
            setTimeout(() => {
                activeContent.classList.remove('active');
                // Показываем новую вкладку
                targetContent.classList.add('active');
                // Форсируем reflow
                targetContent.offsetHeight;
                // Анимируем появление
                targetContent.style.opacity = '1';
                targetContent.style.transform = 'translateY(0) scale(1)';
            }, 300);
        } else {
            // Если активной вкладки нет, просто показываем новую
            targetContent.classList.add('active');
            targetContent.style.opacity = '1';
            targetContent.style.transform = 'translateY(0) scale(1)';
        }
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;
            switchTab(tabId);
        });
    });

    // Получаем элементы модального окна
    const modal = document.getElementById('paymentModal');
    const closeBtn = document.querySelector('.close');
    const privilegeTitle = document.getElementById('privilegeTitle');
    const paymentAmount = document.getElementById('paymentAmount');

    // Функция для показа модального окна оплаты
    window.showPayment = (privilege, amount) => {
        privilegeTitle.textContent = privilege;
        paymentAmount.textContent = amount;
        modal.style.display = 'block';
        
        // Добавляем анимацию появления
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);
    };

    // Закрытие модального окна
    closeBtn.onclick = () => {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    };

    // Закрытие при клике вне модального окна
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    };

    // Копирование номера карты
    window.copyCard = () => {
        const cardNumber = document.querySelector('.card-number').textContent;
        navigator.clipboard.writeText(cardNumber).then(() => {
            alert('Номер карты скопирован!');
        });
    };

    // Подтверждение оплаты
    window.confirmPayment = () => {
        const nickname = prompt('Введите ваш никнейм в игре:');
        if (nickname) {
            alert(`Спасибо за оплату! Мы проверим платеж и выдадим привилегию на никнейм ${nickname} в течение 5 минут.`);
            modal.style.display = 'none';
            
            // Здесь можно добавить отправку данных на сервер или в Discord/Telegram бот
            // Например, отправить webhook в Discord с информацией о платеже
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
}); 