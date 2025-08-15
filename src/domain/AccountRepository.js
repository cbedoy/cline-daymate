/**
 * @interface
 */
export class AccountRepository {
    async getAll() {
        throw new Error("Method 'getAll()' must be implemented.");
    }

    async save(account) {
        throw new Error("Method 'save(account)' must be implemented.");
    }

    async delete(accountId) {
        throw new Error("Method 'delete(accountId)' must be implemented.");
    }
}
