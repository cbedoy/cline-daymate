# Day-Mate

Day-Mate is a simple, client-side web application designed to help you manage your financial accounts and credit cards. It provides a clean interface to track your funds, returns, and card payment deadlines.

## Features

- **Account Management**:
  - Add, edit, and delete financial accounts.
  - Track the name, amount, and annual yield for each account.
  - View a summary of your total funds and the average yield.

- **Credit Card Management**:
  - Add, edit, and delete your credit cards.
  - Store card name, cut-off date, payment due date, and current debt.
  - Assign a color to each card for easy identification.

- **Payment Calendar**:
  - A visual calendar that displays all your upcoming credit card payment deadlines.
  - Events are color-coded to match your cards.

- **Additional Payments**:
  - Track recurring monthly payments like subscriptions or services.
  - Each payment has a name, amount, and a specific day and month.
  - View all additional payments in their own dedicated calendar.

## How to Use

No installation is required. Simply open the `index.html` file in any modern web browser to start using the application. All data is stored locally in your browser's `localStorage`.

## Architecture

The application is structured following Clean Architecture principles to ensure a separation of concerns, making the codebase scalable and maintainable. The main layers are:

- **/src/domain**: Contains the core business logic, including entities (Account, Card), repository interfaces, and use cases.
- **/src/data**: Implements the data sources. Currently, it uses `localStorage` to persist data.
- **/src/app**: Acts as the presentation layer, connecting the UI with the domain logic through presenters.
- **/src/ui**: Contains the visual elements, including the CSS for the Material Design theme.

This structure decouples the business rules from the UI and data storage, making it easier to modify or extend the application in the future.
