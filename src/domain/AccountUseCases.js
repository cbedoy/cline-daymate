import { createAccount } from './entities.js';

export class AccountUseCases {
    constructor(accountRepository) {
        this.accountRepository = accountRepository;
    }

    async getAccounts() {
        return this.accountRepository.getAll();
    }

    async addOrUpdateAccount(accountData) {
        const account = createAccount(accountData);
        return this.accountRepository.save(account);
    }

    async deleteAccount(accountId) {
        return this.accountRepository.delete(accountId);
    }

    calculateSummary(accounts) {
        const totalAccounts = accounts.length;
        const totalAmount = accounts.reduce((sum, acc) => sum + acc.amount, 0);
        const weightedYieldSum = accounts.reduce((sum, acc) => sum + (acc.amount * acc.yieldRate), 0);
        const totalYield = totalAmount > 0 ? weightedYieldSum / totalAmount : 0;

        return {
            totalAccounts,
            totalAmount,
            totalYield
        };
    }
}
