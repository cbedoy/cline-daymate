import { AccountUseCases } from '../domain/AccountUseCases.js';
import { CardUseCases } from '../domain/CardUseCases.js';
import { AccountUseCases } from '../domain/AccountUseCases.js';
import { CardUseCases } from '../domain/CardUseCases.js';
import { PaymentUseCases } from '../domain/PaymentUseCases.js';
import { LocalStorageAccountRepository } from '../data/LocalStorageAccountRepository.js';
import { LocalStorageCardRepository } from '../data/LocalStorageCardRepository.js';
import { LocalStoragePaymentRepository } from '../data/LocalStoragePaymentRepository.js';
import { setLanguage, getLanguage, translatePage } from '../i18n/index.js';
import { AccountsPresenter } from './AccountsPresenter.js';
import { CardsPresenter } from './CardsPresenter.js';
import { PaymentsPresenter } from './PaymentsPresenter.js';

document.addEventListener('DOMContentLoaded', () => {
    const languageSwitcher = document.getElementById('language-switcher');
    languageSwitcher.value = getLanguage();
    translatePage();

    languageSwitcher.addEventListener('change', (e) => {
        setLanguage(e.target.value);
    });

    // Dependency Injection
    const accountRepository = new LocalStorageAccountRepository();
    const cardRepository = new LocalStorageCardRepository();
    const paymentRepository = new LocalStoragePaymentRepository();

    const accountUseCases = new AccountUseCases(accountRepository);
    const cardUseCases = new CardUseCases(cardRepository);
    const paymentUseCases = new PaymentUseCases(paymentRepository);

    // Initialize presenters based on the current page
    if (document.getElementById('accounts-page')) {
        new AccountsPresenter(accountUseCases);
    }

    if (document.getElementById('cards-page')) {
        new CardsPresenter(cardUseCases);
    }

    if (document.getElementById('payments-page')) {
        new PaymentsPresenter(paymentUseCases);
    }
});
