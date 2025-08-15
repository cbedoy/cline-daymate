export class AccountsPresenter {
    constructor(accountUseCases) {
        this.accountUseCases = accountUseCases;
        this.initialize();
    }

    async initialize() {
        this.accountForm = document.getElementById('account-form');
        this.accountIdInput = document.getElementById('account-id');
        this.accountNameInput = document.getElementById('account-name');
        this.amountInput = document.getElementById('amount');
        this.yieldInput = document.getElementById('yield');
        this.accountsTableBody = document.querySelector('#accounts-table tbody');
        this.totalAccountsSpan = document.getElementById('total-accounts');
        this.totalAmountSpan = document.getElementById('total-amount');
        this.totalYieldSpan = document.getElementById('total-yield');

        this.accountForm.addEventListener('submit', this.handleSubmit.bind(this));
        this.accountsTableBody.addEventListener('click', this.handleTableClick.bind(this));

        await this.renderAccounts();
    }

    async renderAccounts() {
        const accounts = await this.accountUseCases.getAccounts();
        this.accountsTableBody.innerHTML = '';
        if (accounts.length === 0) {
            this.accountsTableBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No hay cuentas registradas.</td></tr>';
        } else {
            accounts.forEach(account => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${account.name}</td>
                    <td>$${account.amount.toFixed(2)}</td>
                    <td>${account.yieldRate.toFixed(2)}%</td>
                    <td>
                        <button class="btn-edit" data-id="${account.id}">Editar</button>
                        <button class="btn-delete" data-id="${account.id}">Eliminar</button>
                    </td>
                `;
                this.accountsTableBody.appendChild(row);
            });
        }
        this.updateSummary(accounts);
    }

    updateSummary(accounts) {
        const summary = this.accountUseCases.calculateSummary(accounts);
        this.totalAccountsSpan.textContent = summary.totalAccounts;
        this.totalAmountSpan.textContent = `$${summary.totalAmount.toFixed(2)}`;
        this.totalYieldSpan.textContent = `${summary.totalYield.toFixed(2)}%`;
    }

    async handleSubmit(e) {
        e.preventDefault();
        const accountData = {
            id: this.accountIdInput.value ? parseInt(this.accountIdInput.value) : undefined,
            name: this.accountNameInput.value,
            amount: parseFloat(this.amountInput.value),
            yieldRate: parseFloat(this.yieldInput.value)
        };

        await this.accountUseCases.addOrUpdateAccount(accountData);
        this.resetForm();
        await this.renderAccounts();
    }

    async handleTableClick(e) {
        if (e.target.classList.contains('btn-edit')) {
            const id = parseInt(e.target.dataset.id);
            const accounts = await this.accountUseCases.getAccounts();
            const account = accounts.find(acc => acc.id === id);
            this.accountIdInput.value = account.id;
            this.accountNameInput.value = account.name;
            this.amountInput.value = account.amount;
            this.yieldInput.value = account.yieldRate;
        }

        if (e.target.classList.contains('btn-delete')) {
            const id = parseInt(e.target.dataset.id);
            await this.accountUseCases.deleteAccount(id);
            await this.renderAccounts();
        }
    }

    resetForm() {
        this.accountForm.reset();
        this.accountIdInput.value = '';
    }
}
