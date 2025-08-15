import { CardRepository } from '../domain/CardRepository.js';

export class LocalStorageCardRepository extends CardRepository {
    constructor() {
        super();
        this.storageKey = 'cards';
    }

    async getAll() {
        const cardsData = JSON.parse(localStorage.getItem(this.storageKey)) || [];
        return cardsData;
    }

    async save(card) {
        const cards = await this.getAll();
        const existingIndex = cards.findIndex(c => c.id === card.id);

        if (existingIndex > -1) {
            cards[existingIndex] = card;
        } else {
            cards.push(card);
        }
        localStorage.setItem(this.storageKey, JSON.stringify(cards));
        return card;
    }

    async delete(cardId) {
        let cards = await this.getAll();
        cards = cards.filter(c => c.id !== cardId);
        localStorage.setItem(this.storageKey, JSON.stringify(cards));
    }
}
