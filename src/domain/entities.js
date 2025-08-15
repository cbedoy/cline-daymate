// Using factory functions for simplicity and to avoid `this` context issues.

export const createAccount = ({ id = Date.now(), name, amount, yieldRate }) => {
    if (!name || typeof amount !== 'number' || typeof yieldRate !== 'number') {
        throw new Error('Invalid account data');
    }
    return { id, name, amount, yieldRate };
};

export const createCard = ({ id = Date.now(), name, dueDateDay, dueDateMonth, paymentDateDay, paymentDateMonth, debt, color }) => {
    if (!name || !dueDateDay || !dueDateMonth || !paymentDateDay || !paymentDateMonth || typeof debt !== 'number' || !color) {
        throw new Error('Invalid card data');
    }
    return { id, name, dueDateDay, dueDateMonth, paymentDateDay, paymentDateMonth, debt, color };
};

export const createPayment = ({ id = Date.now(), name, paymentDay, paymentMonth, amount }) => {
    if (!name || !paymentDay || !paymentMonth || typeof amount !== 'number') {
        throw new Error('Invalid payment data');
    }
    return { id, name, paymentDay, paymentMonth, amount };
};
