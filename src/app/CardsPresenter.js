export class CardsPresenter {
    constructor(cardUseCases) {
        this.cardUseCases = cardUseCases;
        this.initialize();
    }

    async initialize() {
        this.cardForm = document.getElementById('card-form');
        this.cardIdInput = document.getElementById('card-id');
        this.cardNameInput = document.getElementById('card-name');
        this.dueDateDaySelect = document.getElementById('due-date-day');
        this.dueDateMonthSelect = document.getElementById('due-date-month');
        this.paymentDateDaySelect = document.getElementById('payment-date-day');
        this.paymentDateMonthSelect = document.getElementById('payment-date-month');
        this.debtInput = document.getElementById('debt');
        this.cardColorInput = document.getElementById('card-color');
        this.cardsListDiv = document.getElementById('cards-list');
        this.calendarEl = document.getElementById('calendar');

        this.months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        this.populateDateSelectors();

        this.cardForm.addEventListener('submit', this.handleSubmit.bind(this));
        this.cardsListDiv.addEventListener('click', this.handleCardClick.bind(this));

        await this.renderCards();
        this.initializeCalendar();
    }

    populateDateSelectors() {
        for (let i = 1; i <= 31; i++) {
            this.dueDateDaySelect.innerHTML += `<option value="${i}">${i}</option>`;
            this.paymentDateDaySelect.innerHTML += `<option value="${i}">${i}</option>`;
        }
        this.months.forEach((month, index) => {
            this.dueDateMonthSelect.innerHTML += `<option value="${index}">${month}</option>`;
            this.paymentDateMonthSelect.innerHTML += `<option value="${index}">${month}</option>`;
        });
    }

    async renderCards() {
        const cards = await this.cardUseCases.getCards();
        this.cardsListDiv.innerHTML = '';
        if (cards.length === 0) {
            this.cardsListDiv.innerHTML = '<p style="text-align:center;">No hay tarjetas registradas.</p>';
        } else {
            cards.forEach(card => {
                const cardElement = document.createElement('div');
                cardElement.classList.add('card');
                cardElement.style.backgroundColor = card.color;
                cardElement.innerHTML = `
                    <h3>${card.name}</h3>
                    <p>Fecha de Corte: ${card.dueDateDay} de ${this.months[card.dueDateMonth]}</p>
                    <p>Fecha Límite de Pago: ${card.paymentDateDay} de ${this.months[card.paymentDateMonth]}</p>
                    <p>Deuda: $${parseFloat(card.debt).toFixed(2)}</p>
                    <div class="card-actions">
                        <button class="btn-edit" data-id="${card.id}">✏️</button>
                        <button class="btn-delete" data-id="${card.id}">🗑️</button>
                    </div>
                `;
                this.cardsListDiv.appendChild(cardElement);
            });
        }
        this.initializeCalendar();
    }

    async initializeCalendar() {
        const cards = await this.cardUseCases.getCards();
        const events = [];
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();

        cards.forEach(card => {
            for (let year = currentYear; year <= currentYear + 1; year++) {
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

        if (this.calendar) {
            this.calendar.destroy();
        }

        this.calendar = new FullCalendar.Calendar(this.calendarEl, {
            initialView: 'dayGridMonth',
            locale: 'es',
            events: events,
            eventDisplay: 'block'
        });
        this.calendar.render();
    }

    async handleSubmit(e) {
        e.preventDefault();
        const cardData = {
            id: this.cardIdInput.value ? parseInt(this.cardIdInput.value) : undefined,
            name: this.cardNameInput.value,
            dueDateDay: this.dueDateDaySelect.value,
            dueDateMonth: this.dueDateMonthSelect.value,
            paymentDateDay: this.paymentDateDaySelect.value,
            paymentDateMonth: this.paymentDateMonthSelect.value,
            debt: parseFloat(this.debtInput.value),
            color: this.cardColorInput.value
        };

        await this.cardUseCases.addOrUpdateCard(cardData);
        this.resetForm();
        await this.renderCards();
    }

    async handleCardClick(e) {
        const editButton = e.target.closest('.btn-edit');
        const deleteButton = e.target.closest('.btn-delete');

        if (editButton) {
            const id = parseInt(editButton.dataset.id);
            const cards = await this.cardUseCases.getCards();
            const card = cards.find(c => c.id === id);
            this.cardIdInput.value = card.id;
            this.cardNameInput.value = card.name;
            this.dueDateDaySelect.value = card.dueDateDay;
            this.dueDateMonthSelect.value = card.dueDateMonth;
            this.paymentDateDaySelect.value = card.paymentDateDay;
            this.paymentDateMonthSelect.value = card.paymentDateMonth;
            this.debtInput.value = card.debt;
            this.cardColorInput.value = card.color;
        }

        if (deleteButton) {
            const id = parseInt(deleteButton.dataset.id);
            await this.cardUseCases.deleteCard(id);
            await this.renderCards();
        }
    }

    resetForm() {
        this.cardForm.reset();
        this.cardIdInput.value = '';
        this.cardColorInput.value = '#ffffff';
    }
}
