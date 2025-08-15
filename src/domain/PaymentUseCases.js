import { createPayment } from './entities.js';

export class PaymentUseCases {
    constructor(paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    async getPayments() {
        return this.paymentRepository.getAll();
    }

    async addOrUpdatePayment(paymentData) {
        const payment = createPayment(paymentData);
        return this.paymentRepository.save(payment);
    }

    async deletePayment(paymentId) {
        return this.paymentRepository.delete(paymentId);
    }
}
