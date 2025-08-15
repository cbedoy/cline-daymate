export class PaymentsPresenter {
    constructor(paymentUseCases) {
        this.paymentUseCases = paymentUseCases;
        this.initialize();
    }

    async initialize() {
        this.paymentForm = document.getElementById('payment-form');
        this.paymentIdInput = document.getElementById('payment-id');
        this.paymentNameInput = document.getElementById('payment-name');
        this.paymentDaySelect = document.getElementById('payment-day');
        this.paymentMonthSelect = document.getElementById('payment-month');
        this.amountInput = document.getElementById('amount');
        this.paymentsListDiv = document.getElementById('payments-list');
        this.calendarEl = document.getElementById('calendar');

        this.months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        this.populateDateSelectors();

        this.paymentForm.addEventListener('submit', this.handleSubmit.bind(this));
        this.paymentsListDiv.addEventListener('click', this.handlePaymentClick.bind(this));

        await this.renderPayments();
        this.initializeCalendar();
    }

    populateDateSelectors() {
        for (let i = 1; i <= 31; i++) {
            this.paymentDaySelect.innerHTML += `<option value="${i}">${i}</option>`;
        }
        this.months.forEach((month, index) => {
            this.paymentMonthSelect.innerHTML += `<option value="${index}">${month}</option>`;
        });
    }

    async renderPayments() {
        const payments = await this.paymentUseCases.getPayments();
        this.paymentsListDiv.innerHTML = '';
        if (payments.length === 0) {
            this.paymentsListDiv.innerHTML = '<p style="text-align:center;">No hay pagos registrados.</p>';
        } else {
            payments.forEach(payment => {
                const paymentElement = document.createElement('div');
                paymentElement.classList.add('card'); // Re-using card style for consistency
                paymentElement.innerHTML = `
                    <h3>${payment.name}</h3>
                    <p>Fecha de Pago: ${payment.paymentDay} de ${this.months[payment.paymentMonth]}</p>
                    <p>Monto: $${parseFloat(payment.amount).toFixed(2)}</p>
                    <div class="card-actions">
                        <button class="btn-edit" data-id="${payment.id}">✏️</button>
                        <button class="btn-delete" data-id="${payment.id}">🗑️</button>
                    </div>
                `;
                this.paymentsListDiv.appendChild(paymentElement);
            });
        }
        this.initializeCalendar();
    }

    async initializeCalendar() {
        const payments = await this.paymentUseCases.getPayments();
        const events = [];
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();

        payments.forEach(payment => {
            for (let year = currentYear; year <= currentYear + 1; year++) {
                for (let month = (year === currentYear ? currentMonth : 0); month < 12; month++) {
                    if (parseInt(payment.paymentMonth) === month) {
                        events.push({
                            title: `${payment.name} - $${parseFloat(payment.amount).toFixed(2)}`,
                            start: `${year}-${String(month + 1).padStart(2, '0')}-${String(payment.paymentDay).padStart(2, '0')}`,
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
        const paymentData = {
            id: this.paymentIdInput.value ? parseInt(this.paymentIdInput.value) : undefined,
            name: this.paymentNameInput.value,
            paymentDay: this.paymentDaySelect.value,
            paymentMonth: this.paymentMonthSelect.value,
            amount: parseFloat(this.amountInput.value),
        };

        await this.paymentUseCases.addOrUpdatePayment(paymentData);
        this.resetForm();
        await this.renderPayments();
    }

    async handlePaymentClick(e) {
        const editButton = e.target.closest('.btn-edit');
        const deleteButton = e.target.closest('.btn-delete');

        if (editButton) {
            const id = parseInt(editButton.dataset.id);
            const payments = await this.paymentUseCases.getPayments();
            const payment = payments.find(p => p.id === id);
            this.paymentIdInput.value = payment.id;
            this.paymentNameInput.value = payment.name;
            this.paymentDaySelect.value = payment.paymentDay;
            this.paymentMonthSelect.value = payment.paymentMonth;
            this.amountInput.value = payment.amount;
        }

        if (deleteButton) {
            const id = parseInt(deleteButton.dataset.id);
            await this.paymentUseCases.deletePayment(id);
            await this.renderPayments();
        }
    }

    resetForm() {
        this.paymentForm.reset();
        this.paymentIdInput.value = '';
    }
}
