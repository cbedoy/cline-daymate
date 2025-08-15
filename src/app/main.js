import { AccountUseCases } from '../domain/AccountUseCases.js';
import { CardUseCases } from '../domain/CardUseCases.js';
import { LocalStorageAccountRepository } from '../data/LocalStorageAccountRepository.js';
import { LocalStorageCardRepository } from '../data/LocalStorageCardRepository.js';
import { AccountsPresenter } from './AccountsPresenter.js';
import { CardsPresenter } from './CardsPresenter.js';

document.addEventListener('DOMContentLoaded', () => {
    // Dependency Injection
    const accountRepository = new LocalStorageAccountRepository();
    const cardRepository = new LocalStorageCardRepository();

    const accountUseCases = new AccountUseCases(accountRepository);
    const cardUseCases = new CardUseCases(cardRepository);

    // Initialize presenters based on the current page
    if (document.getElementById('accounts-page')) {
        new AccountsPresenter(accountUseCases);
    }

    if (document.getElementById('cards-page')) {
        new CardsPresenter(cardUseCases);
    }
});
