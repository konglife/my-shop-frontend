---
trigger: always_on
---

# Project Rules: Repair Shop Management (Vue 3 + Strapi 5)

## 1. Core Principles & Stack

- **Backend:** The backend is a pre-built **Strapi v5** application.
- **Frontend Framework:** Use **Vue 3** with the Composition API and `<script setup>`.
- **State Management:** Use **Pinia** for all global state management. The auth store is critical for storing the JWT and user data.
- **Routing:** Use **Vue Router**.
- **HTTP Client:** Use **Axios**. Create a centralized API service layer with an Axios instance.
- **UI Components:** Use the **Naive UI** library for all UI elements.
- **Language:** Use **TypeScript**.

## 2. Strapi v5 API Interaction

### API Base URL

- **Production:** `https://my-shop-backend-g2k6.onrender.com`
- **Development (Example):** `https://my-shop-backend-g2k6.onrender.com`
- The base URL should be managed via environment variables (e.g., `import.meta.env.VITE_API_URL`).

### Endpoint Structure

- API endpoints follow the pattern: `/api/[content-type-plural-name]`.
- Example: `/api/products`, `/api/customers`, `/api/repair-jobs`.

### IMPORTANT: `documentId` vs. Numeric `id`

- For single-entry operations (GET one, PUT, DELETE), the path parameter is a **string `documentId`**, NOT a numeric ID.
    - Correct: `GET /api/products/{documentId}`
    - Incorrect: `GET /api/products/1`
- To query by the old numeric `id`, you MUST use a filter:
    - `GET /api/products?filters[id][$eq]=1`

### Payload & Response Structure (Critical!)

- **ALL `POST` and `PUT` requests** MUST wrap the payload inside a `data` object.
    
    ```json
    {
      "data": {
        "name": "New Product",
        "selling_price": 100
      }
    }
    ```
    
- Responses for single items are wrapped in a `data` object.
- Responses for lists are an array inside a `data` object (`"data": []`).

### Query Parameters

- **Populate Relations:** Always use the `populate` query parameter to fetch related data. Use `populate=*` for all levels or specify relations like `populate=category,unit`.
- **Filtering:** Use the `filters` parameter for searching, e.g., `filters[name][$contains]=iPhone`.
- **Sorting:** Use `sort`, e.g., `sort=name:asc`.
- **Pagination:** Use `pagination[page]` and `pagination[pageSize]`.

## 3. Authentication & Authorization

- **Login Endpoint:** `POST /api/auth/local` with `identifier` and `password`.
- **Registration Endpoint:** `POST /api/auth/local/register` with `username`, `email`, and `password`.
- **JWT Usage:** A successful login returns a `jwt` token.
- **ALL authenticated requests** MUST include the JWT in the header: `Authorization: Bearer {jwt}`.
- Use Axios interceptors to automatically attach the `Authorization` header to outgoing requests.

## 4. Business Logic & Validation (Detailed Mandates)

This rule is critical. The backend is the **single source of truth** for all business logic, calculations, and complex validations. The frontend's role is to act as a user interface (a "remote control") for this logic, not to replicate it.

### The Core Principle: Backend is the Brain, Frontend is the Interface

- All critical business logic, such as stock management (deductions, additions), cost calculations (average cost, total cost), and data formatting (e.g., phone numbers) is implemented exclusively in the Strapi backend using lifecycle hooks and services.
- The frontend's primary responsibility is to collect user input and trigger these backend processes. It should trust the backend to perform the logic correctly and handle the outcomes.

### Prohibitions: What the Frontend MUST NOT DO

- **DO NOT** calculate stock levels. For example, do not manually subtract from a quantity when a sale is made.
- **DO NOT** calculate costs. Do not attempt to compute `average_cost` for stock, `total_cost` for a sale, or `parts_cost` for a repair job on the client-side.
- **DO NOT** implement complex validation that already exists on the backend (e.g., checking if a product name is unique). Rely on the backend's 400 error response for this.
- **DO NOT** assume a successful request means the logic is complete. Always fetch the updated data from the backend to reflect the true state after a successful operation.

### The Frontend's Role: Triggering Backend Logic via Status Changes

The primary way the frontend interacts with backend logic is by changing the `status` of an entity. This acts as a trigger for the backend to execute its processes.

- **Example 1: Receiving a Purchase**
    - **Frontend Action:** The user clicks a "Receive Items" button. The frontend sends a `PUT` request to `/api/purchases/{documentId}` with the payload: `{"data": {"status_purchase": "RECEIVED"}}`.
    - **Backend Logic (Triggered):** The Strapi backend detects the status change. It then automatically:
        1. Iterates through the `purchase_items`.
        2. Updates the `quantity` and `average_cost` in the `Stock` for each related `Product`.
        3. Updates the `received_date`.

- **Example 2: Completing a Sale**
    - **Frontend Action:** The user finalizes a sale. The frontend sends a `PUT` request to `/api/sales/{documentId}` with the payload: `{"data": {"status_sale": "COMPLETED"}}`.
    - **Backend Logic (Triggered):** The backend detects the status change and automatically:
        1. Deducts the `quantity` from the `Stock` for each `Product` in `sale_items`.
        2. Records the `price_at_time` and `cost_at_time` for each `SaleItem` based on the current data.

### Summary of Auto-Managed Fields (Treat as Read-Only)

The frontend should **never send** data for these fields in `POST` or `PUT` requests. They are managed entirely by the backend.

- **General:** `id`, `documentId`, `createdAt`, `updatedAt`.
- **Stock-related:** `Stock.quantity` (in most cases), `Stock.average_cost`.
- **Sale-related:** `SaleItem.price_at_time`, `SaleItem.cost_at_time`.
- **Repair-related:** `RepairJob.parts_cost`, `RepairJob.labor_cost`.
- **Data Formatting:** `Supplier.phone` (backend auto-formats to E.164).

If the frontend sends invalid data (e.g., a required field is missing), it should expect a `400 Bad Request` error and display the `error.message` to the user.


## 5. Error Handling

- Expect error responses to have a specific structure containing an `error` object.JSON
    
    `{
      "error": {
        "status": 400,
        "name": "ValidationError",
        "message": "details about the error"
      }
    }`
    
- Always check for `error.status` and `error.message` in `catch` blocks.
- If `status` is 401 (Unauthorized) or 403 (Forbidden), redirect the user to the login page.

## 6. Content Types & Relations (Detailed)

This section details each content type, its key fields, and its relationships. When creating or updating an entry, any field representing a relationship must be assigned the `documentId` of the related entry.

### CATEGORY

- **Key Fields:** `name` (string, required).
- **Relations:**
    - Is the target of a one-to-one relationship from `Product` (via `Product.category`).

### CUSTOMER

- **Key Fields:** `name` (string, required), `phone`, `email`, `address`.
- **Relations:**
    - **`repair_jobs`**: One-to-Many with `REPAIR_JOB`.
    - **`sales`**: One-to-Many with `SALE`.

### PRODUCT

- **Key Fields:** `name` (string, required), `description` (blocks), `selling_price` (decimal, required).
- **Relations:**
    - **`category`**: One-to-One to `CATEGORY`.
    - **`unit`**: One-to-One to `UNIT`.
    - **`stock`**: One-to-One to `STOCK`.
    - Is the target of many-to-one relationships from `PURCHASE_ITEM`, `SALE_ITEM`, and `USED_PART`.

### PURCHASE

- **Key Fields:** `status_purchase` (enum: PENDING, RECEIVED, CANCELLED), `order_date`, `received_date`.
- **Relations:**
    - **`supplier`**: Many-to-One to `SUPPLIER`.
    - **`purchase_items`**: One-to-Many with `PURCHASE_ITEM`.

### PURCHASE_ITEM

- **Key Fields:** `quantity` (integer, required), `unit_price` (decimal, required).
- **Relations:**
    - **`purchase`**: Many-to-One to `PURCHASE`.
    - **`product`**: Many-to-One to `PRODUCT`.

### REPAIR_JOB

- **Key Fields:** `name` (string, required), `description`, `status_repair` (enum: IN_PROGRESS, COMPLETED, CANCELLED), `total_cost` (decimal, required).
- **Relations:**
    - **`customer`**: Many-to-One to `CUSTOMER`.
    - **`used_parts`**: One-to-Many with `USED_PART`.

### SALE

- **Key Fields:** `total_amount` (decimal), `total_cost` (decimal), `status_sale` (enum: DRAFT, COMPLETED, CANCELLED).
- **Relations:**
    - **`customer`**: Many-to-One to `CUSTOMER`.
    - **`sale_items`**: One-to-Many with `SALE_ITEM`.

### SALE_ITEM

- **Key Fields:** `quantity` (integer, required), `price_at_time` (decimal), `cost_at_time` (decimal).
- **Relations:**
    - **`sale`**: Many-to-One to `SALE`.
    - **`product`**: Many-to-One to `PRODUCT`.

### STOCK

- **Key Fields:** `quantity` (integer), `min_quantity` (integer), `average_cost` (decimal).
- **Relations:**
    - **`product`**: One-to-One to `PRODUCT`.

### SUPPLIER

- **Key Fields:** `name` (string, required), `contact_person`, `phone`, `email`.
- **Relations:**
    - Is the target of a many-to-one relationship from `Purchase` (via `Purchase.supplier`).

### UNIT

- **Key Fields:** `name` (string, required).
- **Relations:**
    - Is the target of a one-to-one relationship from `Product` (via `Product.unit`).

### USED_PART

- **Key Fields:** `quantity` (integer, required), `cost_at_time` (decimal).
- **Relations:**
    - **`repair_job`**: Many-to-One to `REPAIR_JOB`.
    - **`product`**: Many-to-One to `PRODUCT`.