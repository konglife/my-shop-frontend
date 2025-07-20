# My Shop Frontend

This is the frontend application for the "My Shop" management system, built with Vue 3. It serves as a user interface (a "remote control") for the Strapi v5 backend, allowing for the management of products, sales, repairs, and customers.

This project is being developed in collaboration with an AI assistant, Cascade.

---

## Tech Stack

*   **Framework:** [Vue 3](https://vuejs.org/) with `<script setup>`
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **UI Library:** [Naive UI](https://www.naiveui.com/)
*   **Routing:** [Vue Router](https://router.vuejs.org/)
*   **State Management:** [Pinia](https://pinia.vuejs.org/)
*   **HTTP Client:** [Axios](https://axios-http.com/)

## Backend API

The backend for this project is a pre-built Strapi v5 application. All business logic, data storage, and validation are handled by the backend.

*   **Production API URL:** `https://my-shop-backend-g2k6.onrender.com`

## Project Setup

1.  **Clone the repository:**
    ```sh
    git clone <repository-url>
    cd my-shop-frontend
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Create a file named `.env.local` in the root of the project and add the following line:
    ```
    VITE_API_URL=https://my-shop-backend-g2k6.onrender.com
    ```

4.  **Run the development server:**
    ```sh
    npm run dev
    ```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

