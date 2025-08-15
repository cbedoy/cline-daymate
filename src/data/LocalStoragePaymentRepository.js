import { PaymentRepository } from '../domain/PaymentRepository.js';

export class LocalStoragePaymentRepository extends PaymentRepository {
    constructor() {
        super();
        this.storageKey = 'payments';
    }

    async getAll() {
        const paymentsData = JSON.parse(localStorage.getItem(this.storageKey)) || [];
        return paymentsData;
    }

    async save(payment) {
        const payments = await this.getAll();
        const existingIndex = payments.findIndex(p => p.id === payment.id);

        if (existingIndex > -1) {
            payments[existingIndex] = payment;
        } else {
            payments.push(payment);
        }
        localStorage.setItem(this.storageKey, JSON.stringify(payments));
        return payment;
    }

    async delete(paymentId) {
        let payments = await this.getAll();
        payments = payments.filter(p => p.id !== paymentId);
        localStorage.setItem(this.storageKey, JSON.stringify(payments));
    }
}
