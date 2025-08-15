/**
 * @interface
 */
export class CardRepository {
    async getAll() {
        throw new Error("Method 'getAll()' must be implemented.");
    }

    async save(card) {
        throw new Error("Method 'save(card)' must be implemented.");
    }

    async delete(cardId) {
        throw new Error("Method 'delete(cardId)' must be implemented.");
    }
}
