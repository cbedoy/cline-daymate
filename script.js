document.addEventListener('DOMContentLoaded', () => {
    const accountForm = document.getElementById('account-form');
    const accountIdInput = document.getElementById('account-id');
    const accountNameInput = document.getElementById('account-name');
    const amountInput = document.getElementById('amount');
    const yieldInput = document.getElementById('yield');
    const accountsTableBody = document.querySelector('#accounts-table tbody');
    const totalAccountsSpan = document.getElementById('total-accounts');
    const totalAmountSpan = document.getElementById('total-amount');
    const totalYieldSpan = document.getElementById('total-yield');

    let accounts = JSON.parse(localStorage.getItem('accounts')) || [];

    const renderAccounts = () => {
        accountsTableBody.innerHTML = '';
        if (accounts.length === 0) {
            accountsTableBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No hay cuentas registradas.</td></tr>';
            return;
        }
        accounts.forEach(account => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${account.name}</td>
                <td>$${account.amount.toFixed(2)}</td>
                <td>${account.yield.toFixed(2)}%</td>
                <td>
                    <button class="btn-edit" data-id="${account.id}">Editar</button>
                    <button class="btn-delete" data-id="${account.id}">Eliminar</button>
                </td>
            `;
            accountsTableBody.appendChild(row);
        });
    };

    const updateSummary = () => {
        const totalAccounts = accounts.length;
        const totalAmount = accounts.reduce((sum, acc) => sum + acc.amount, 0);
        const weightedYieldSum = accounts.reduce((sum, acc) => sum + (acc.amount * acc.yield), 0);
        const totalYield = totalAmount > 0 ? weightedYieldSum / totalAmount : 0;

        totalAccountsSpan.textContent = totalAccounts;
        totalAmountSpan.textContent = `$${totalAmount.toFixed(2)}`;
        totalYieldSpan.textContent = `${totalYield.toFixed(2)}%`;
    };

    const saveAccounts = () => {
        localStorage.setItem('accounts', JSON.stringify(accounts));
    };

    const resetForm = () => {
        accountForm.reset();
        accountIdInput.value = '';
    };

    accountForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = accountIdInput.value;
        const name = accountNameInput.value;
        const amount = parseFloat(amountInput.value);
        const yieldPercent = parseFloat(yieldInput.value);

        if (id) {
            // Update existing account
            const account = accounts.find(acc => acc.id == id);
            account.name = name;
            account.amount = amount;
            account.yield = yieldPercent;
        } else {
            // Add new account
            const newAccount = {
                id: Date.now(),
                name,
                amount,
                yield: yieldPercent
            };
            accounts.push(newAccount);
        }

        saveAccounts();
        renderAccounts();
        updateSummary();
        resetForm();
    });

    accountsTableBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-edit')) {
            const id = e.target.dataset.id;
            const account = accounts.find(acc => acc.id == id);
            accountIdInput.value = account.id;
            accountNameInput.value = account.name;
            amountInput.value = account.amount;
            yieldInput.value = account.yield;
        }

        if (e.target.classList.contains('btn-delete')) {
            const id = e.target.dataset.id;
            accounts = accounts.filter(acc => acc.id != id);
            saveAccounts();
            renderAccounts();
            updateSummary();
        }
    });

    // Initial render
    renderAccounts();
    updateSummary();
});
