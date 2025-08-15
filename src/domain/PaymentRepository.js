/**
 * @interface
 */
export class PaymentRepository {
    async getAll() {
        throw new Error("Method 'getAll()' must be implemented.");
    }

    async save(payment) {
        throw new Error("Method 'save(payment)' must be implemented.");
    }

    async delete(paymentId) {
        throw new Error("Method 'delete(paymentId)' must be implemented.");
    }
}
