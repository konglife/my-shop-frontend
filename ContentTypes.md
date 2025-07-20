# Strapi Content Types & Relations

This document provides a detailed overview of all content types, their key fields, and their relationships within the Strapi backend. This serves as a quick reference for frontend development.

---

### CATEGORY
- **Strapi Fields:** `id` (numeric), `documentId` (string), `createdAt`, `updatedAt`, `publishedAt` (datetimes).
- **Key Fields:** `name` (string, required).
- **Relations:**
    - Is the target of a one-to-one relationship from `Product` (via `Product.category`).

---

### CUSTOMER
- **Strapi Fields:** `id` (numeric), `documentId` (string), `createdAt`, `updatedAt`, `publishedAt` (datetimes).
- **Key Fields:** `name` (string, required), `phone`, `email`, `address`.
- **Relations:**
    - **`repair_jobs`**: One-to-Many with `REPAIR_JOB`.
    - **`sales`**: One-to-Many with `SALE`.

---

### PRODUCT
- **Strapi Fields:** `id` (numeric), `documentId` (string), `createdAt`, `updatedAt`, `publishedAt` (datetimes).
- **Key Fields:** `name` (string, required), `description` (blocks), `selling_price` (decimal, required).
- **Relations:**
    - **`category`**: One-to-One to `CATEGORY`.
    - **`unit`**: One-to-One to `UNIT`.
    - **`stock`**: One-to-One to `STOCK`.
    - Is the target of many-to-one relationships from `PURCHASE_ITEM`, `SALE_ITEM`, and `USED_PART`.

---

### PURCHASE
- **Strapi Fields:** `id` (numeric), `documentId` (string), `createdAt`, `updatedAt`, `publishedAt` (datetimes).
- **Key Fields:** `status_purchase` (enum: PENDING, RECEIVED, CANCELLED), `order_date`, `received_date`.
- **Relations:**
    - **`supplier`**: Many-to-One to `SUPPLIER`.
    - **`purchase_items`**: One-to-Many with `PURCHASE_ITEM`.

---

### PURCHASE_ITEM
- **Strapi Fields:** `id` (numeric), `documentId` (string), `createdAt`, `updatedAt`, `publishedAt` (datetimes).
- **Key Fields:** `quantity` (integer, required), `unit_price` (decimal, required).
- **Relations:**
    - **`purchase`**: Many-to-One to `PURCHASE`.
    - **`product`**: Many-to-One to `PRODUCT`.

---

### REPAIR_JOB
- **Strapi Fields:** `id` (numeric), `documentId` (string), `createdAt`, `updatedAt`, `publishedAt` (datetimes).
- **Key Fields:** `name` (string, required), `description`, `status_repair` (enum: IN_PROGRESS, COMPLETED, CANCELLED), `total_cost` (decimal, required).
- **Relations:**
    - **`customer`**: Many-to-One to `CUSTOMER`.
    - **`used_parts`**: One-to-Many with `USED_PART`.

---

### SALE
- **Strapi Fields:** `id` (numeric), `documentId` (string), `createdAt`, `updatedAt`, `publishedAt` (datetimes).
- **Key Fields:** `total_amount` (decimal), `total_cost` (decimal), `status_sale` (enum: DRAFT, COMPLETED, CANCELLED).
- **Relations:**
    - **`customer`**: Many-to-One to `CUSTOMER`.
    - **`sale_items`**: One-to-Many with `SALE_ITEM`.

---

### SALE_ITEM
- **Strapi Fields:** `id` (numeric), `documentId` (string), `createdAt`, `updatedAt`, `publishedAt` (datetimes).
- **Key Fields:** `quantity` (integer, required), `price_at_time` (decimal), `cost_at_time` (decimal).
- **Relations:**
    - **`sale`**: Many-to-One to `SALE`.
    - **`product`**: Many-to-One to `PRODUCT`.

---

### STOCK
- **Strapi Fields:** `id` (numeric), `documentId` (string), `createdAt`, `updatedAt`, `publishedAt` (datetimes).
- **Key Fields:** `quantity` (integer), `min_quantity` (integer), `average_cost` (decimal).
- **Relations:**
    - **`product`**: One-to-One to `PRODUCT`.

---

### SUPPLIER
- **Strapi Fields:** `id` (numeric), `documentId` (string), `createdAt`, `updatedAt`, `publishedAt` (datetimes).
- **Key Fields:** `name` (string, required), `contact_person`, `phone`, `email`.
- **Relations:**
    - Is the target of a many-to-one relationship from `Purchase` (via `Purchase.supplier`).

---

### UNIT
- **Strapi Fields:** `id` (numeric), `documentId` (string), `createdAt`, `updatedAt`, `publishedAt` (datetimes).
- **Key Fields:** `name` (string, required).
- **Relations:**
    - Is the target of a one-to-one relationship from `Product` (via `Product.unit`).

---

### USED_PART
- **Strapi Fields:** `id` (numeric), `documentId` (string), `createdAt`, `updatedAt`, `publishedAt` (datetimes).
- **Key Fields:** `quantity` (integer, required), `cost_at_time` (decimal).
- **Relations:**
    - **`repair_job`**: Many-to-One to `REPAIR_JOB`.
    - **`product`**: Many-to-One to `PRODUCT`.
