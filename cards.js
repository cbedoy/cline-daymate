document.addEventListener('DOMContentLoaded', () => {
    const cardForm = document.getElementById('card-form');
    const cardIdInput = document.getElementById('card-id');
    const cardNameInput = document.getElementById('card-name');
    const dueDateDaySelect = document.getElementById('due-date-day');
    const dueDateMonthSelect = document.getElementById('due-date-month');
    const paymentDateDaySelect = document.getElementById('payment-date-day');
    const paymentDateMonthSelect = document.getElementById('payment-date-month');
    const debtInput = document.getElementById('debt');
    const cardColorInput = document.getElementById('card-color');
    const cardsListDiv = document.getElementById('cards-list');
    const calendarEl = document.getElementById('calendar');

    let cards = JSON.parse(localStorage.getItem('cards')) || [];
    let calendar;

    const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    const populateDateSelectors = () => {
        for (let i = 1; i <= 31; i++) {
            dueDateDaySelect.innerHTML += `<option value="${i}">${i}</option>`;
            paymentDateDaySelect.innerHTML += `<option value="${i}">${i}</option>`;
        }
        months.forEach((month, index) => {
            dueDateMonthSelect.innerHTML += `<option value="${index}">${month}</option>`;
            paymentDateMonthSelect.innerHTML += `<option value="${index}">${month}</option>`;
        });
    };

    const renderCards = () => {
        cardsListDiv.innerHTML = '';
        if (cards.length === 0) {
            cardsListDiv.innerHTML = '<p style="text-align:center;">No hay tarjetas registradas.</p>';
            return;
        }
        cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.style.backgroundColor = card.color;
            cardElement.innerHTML = `
                <h3>${card.name}</h3>
                <p>Fecha de Corte: ${card.dueDateDay} de ${months[card.dueDateMonth]}</p>
                <p>Fecha Límite de Pago: ${card.paymentDateDay} de ${months[card.paymentDateMonth]}</p>
                <p>Deuda: $${parseFloat(card.debt).toFixed(2)}</p>
                <div class="card-actions">
                    <button class="btn-edit" data-id="${card.id}">✏️</button>
                    <button class="btn-delete" data-id="${card.id}">🗑️</button>
                </div>
            `;
            cardsListDiv.appendChild(cardElement);
        });
    };

    const initializeCalendar = () => {
        const events = [];
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();

        cards.forEach(card => {
            // Generate events for the current year and the next
            for (let year = currentYear; year <= currentYear + 1; year++) {
                 // Find the next valid payment date starting from the current month of the current year
                for (let month = (year === currentYear ? currentMonth : 0); month < 12; month++) {
                    if (parseInt(card.paymentDateMonth) === month) {
                         events.push({
                            title: `${card.name} - $${parseFloat(card.debt).toFixed(2)}`,
                            start: `${year}-${String(month + 1).padStart(2, '0')}-${String(card.paymentDateDay).padStart(2, '0')}`,
                            backgroundColor: card.color,
                            borderColor: card.color
                        });
                    }
                }
            }
        });

        if (calendar) {
            calendar.destroy();
        }

        calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            locale: 'es',
            events: events,
            eventDisplay: 'block'
        });
        calendar.render();
    };

    const saveCards = () => {
        localStorage.setItem('cards', JSON.stringify(cards));
    };

    const resetForm = () => {
        cardForm.reset();
        cardIdInput.value = '';
        cardColorInput.value = '#ffffff';
    };

    cardForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = cardIdInput.value;
        const cardData = {
            name: cardNameInput.value,
            dueDateDay: dueDateDaySelect.value,
            dueDateMonth: dueDateMonthSelect.value,
            paymentDateDay: paymentDateDaySelect.value,
            paymentDateMonth: paymentDateMonthSelect.value,
            debt: debtInput.value,
            color: cardColorInput.value
        };

        if (id) {
            const index = cards.findIndex(c => c.id == id);
            cards[index] = { ...cards[index], ...cardData };
        } else {
            cards.push({ id: Date.now(), ...cardData });
        }

        saveCards();
        renderCards();
        initializeCalendar();
        resetForm();
    });

    cardsListDiv.addEventListener('click', (e) => {
        const editButton = e.target.closest('.btn-edit');
        const deleteButton = e.target.closest('.btn-delete');

        if (editButton) {
            const id = editButton.dataset.id;
            const card = cards.find(c => c.id == id);
            cardIdInput.value = card.id;
            cardNameInput.value = card.name;
            dueDateDaySelect.value = card.dueDateDay;
            dueDateMonthSelect.value = card.dueDateMonth;
            paymentDateDaySelect.value = card.paymentDateDay;
            paymentDateMonthSelect.value = card.paymentDateMonth;
            debtInput.value = card.debt;
            cardColorInput.value = card.color;
        }

        if (deleteButton) {
            const id = deleteButton.dataset.id;
            cards = cards.filter(c => c.id != id);
            saveCards();
            renderCards();
            initializeCalendar();
        }
    });

    // Initial setup
    populateDateSelectors();
    renderCards();
    initializeCalendar();
});
