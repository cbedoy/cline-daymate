import { AccountRepository } from '../domain/AccountRepository.js';

export class LocalStorageAccountRepository extends AccountRepository {
    constructor() {
        super();
        this.storageKey = 'accounts';
    }

    async getAll() {
        const accountsData = JSON.parse(localStorage.getItem(this.storageKey)) || [];
        return accountsData;
    }

    async save(account) {
        const accounts = await this.getAll();
        const existingIndex = accounts.findIndex(a => a.id === account.id);

        if (existingIndex > -1) {
            accounts[existingIndex] = account;
        } else {
            accounts.push(account);
        }
        localStorage.setItem(this.storageKey, JSON.stringify(accounts));
        return account;
    }

    async delete(accountId) {
        let accounts = await this.getAll();
        accounts = accounts.filter(a => a.id !== accountId);
        localStorage.setItem(this.storageKey, JSON.stringify(accounts));
    }
}
