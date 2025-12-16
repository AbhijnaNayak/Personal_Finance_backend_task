# Personal Finance App - Postman Collection

## Description
This folder contains the Postman collection and environment for the Personal Finance Management Application backend APIs.

## Files Included
1. PersonalFinanceApp_Collection.json  - All API requests organized in folders (Auth, Wallets, Transactions, Budgets, Report)
2. PersonalFinanceApp_Environment.json - Environment file containing {{jwtToken}} for protected requests
3. README.txt - This instructions file

## Instructions to Use

### 1. Import Collection
- Open Postman.
- Click **Import** → select `PersonalFinanceApp_Collection.json`.

### 2. Import Environment
- Click the **Environment dropdown** → **Manage Environments** → **Import**.
- Select `PersonalFinanceApp_Environment.json`.
- Select the environment (e.g., `Local`) from the dropdown.

### 3. Login
- Send the **POST /api/auth/login** request with your user credentials.
- Copy the token from the response and paste it into the environment variable `jwtToken` (if not already set).

### 4. Send Protected Requests
- All protected routes (Wallets, Transactions, Budgets, Report) automatically use `{{jwtToken}}`.
- Ensure the correct environment is selected in the top-right dropdown.
- Send requests directly; Postman will replace `{{jwtToken}}` with the value from the environment.

### Notes
- Unprotected routes: `/auth/register` and `/auth/login`.
- Protected routes require a JWT token.
- If the token expires, update the `jwtToken` in the environment.
