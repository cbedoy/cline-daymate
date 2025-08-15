import { createCard } from './entities.js';

export class CardUseCases {
    constructor(cardRepository) {
        this.cardRepository = cardRepository;
    }

    async getCards() {
        return this.cardRepository.getAll();
    }

    async addOrUpdateCard(cardData) {
        const card = createCard(cardData);
        return this.cardRepository.save(card);
    }

    async deleteCard(cardId) {
        return this.cardRepository.delete(cardId);
    }
}
