# Strapi 5 Backend: Technical Summary for Frontend (Vue) Developers

## Overview
This backend is built with Strapi v5 and provides a RESTful API for a Repair Shop Management System. All business logic is implemented using Strapi's Content Types, Relations, and Lifecycle hooks. The backend is ready for integration with any frontend (e.g., Vue.js).

## Content Types & Relations

### 1. Category
- **Fields:** name (string, required)
- **API:** `/api/categories`

### 2. Customer
- **Fields:** name (string, required), phone (string), email (email), address (text)
- **Relations:**
  - `repair_jobs`: One-to-Many → RepairJob
  - `sales`: One-to-Many → Sale
- **API:** `/api/customers`

### 3. Product
- **Fields:** name (string, required), description (rich text), selling_price (decimal, required)
- **Relations:**
  - `category`: One-to-One → Category
  - `unit`: One-to-One → Unit
  - `stock`: One-to-One → Stock
- **API:** `/api/products`

### 4. Purchase
- **Fields:** status_purchase (enum: PENDING/RECEIVED/CANCELLED), order_date (datetime), received_date (datetime)
- **Relations:**
  - `supplier`: Many-to-One → Supplier
  - `purchase_items`: One-to-Many → PurchaseItem
- **API:** `/api/purchases`

### 5. RepairJob
- **Fields:** name (string, required), description (text), status_repair (enum: IN_PROGRESS/COMPLETED/CANCELLED), total_cost (decimal, required), parts_cost (decimal), labor_cost (decimal)
- **Relations:**
  - `customer`: Many-to-One → Customer
  - `used_parts`: One-to-Many → UsedPart
- **API:** `/api/repair-jobs`

### 6. Sale
- **Fields:** total_amount (decimal), total_cost (decimal), status_sale (enum: DRAFT/COMPLETED/CANCELLED)
- **Relations:**
  - `customer`: Many-to-One → Customer
  - `sale_items`: One-to-Many → SaleItem
- **API:** `/api/sales`

### 7. SaleItem
- **Fields:** quantity (integer, required), price_at_time (decimal), cost_at_time (decimal)
- **Relations:**
  - `sale`: Many-to-One → Sale
  - `product`: Many-to-One → Product
- **API:** `/api/sale-items`

### 8. Stock
- **Fields:** quantity (integer), min_quantity (integer, default: 2), average_cost (decimal)
- **Relations:**
  - `product`: One-to-One → Product
- **API:** `/api/stocks`

### 9. Supplier
- **Fields:** name (string, required), contact_person (string), phone (string), email (email)
- **API:** `/api/suppliers`

### 10. Unit
- **Fields:** name (string, required)
- **API:** `/api/units`

### 11. UsedPart
- **Fields:** quantity (integer, required), cost_at_time (decimal)
- **Relations:**
  - `repair_job`: Many-to-One → RepairJob
  - `product`: Many-to-One → Product
- **API:** `/api/used-parts`

### 12. PurchaseItem (New)
- **Fields:** quantity (integer, required), unit_price (decimal, required)
- **Relations:**
  - `purchase`: Many-to-One → Purchase
  - `product`: Many-to-One → Product
- **API:** `/api/purchase-items`

## API Endpoint Patterns (Strapi v5)
- **List:** `GET /api/[plural]`
- **Single (by documentId):** `GET /api/[plural]/{documentId}`
- **Filter by Numeric ID:** `GET /api/[plural]?filters[id][$eq]=1`
- **Create:** `POST /api/[plural]`
- **Update:** `PUT /api/[plural]/{documentId}`
- **Delete:** `DELETE /api/[plural]/{documentId}`

> **Note:** `documentId` is a unique string (not numeric id) used by Strapi v5 for single entry endpoints. Use filters for numeric id queries.

## Authentication & Permissions
- **Public Endpoints:** By default, most endpoints are public during development. For production, configure permissions in Strapi Admin Panel.
- **Authenticated Endpoints:** Use JWT Bearer tokens. Obtain via `/api/auth/local` (username/password).

## Business Logic & Hooks
- Stock management, cost calculation, and phone formatting are handled automatically via Strapi lifecycle hooks.
- For details, see `/src/api/[content-type]/content-types/[content-type]/lifecycles.js` and `/src/api/[content-type]/services/`.

## Example Usage
- **Get all products:** `GET /api/products`
- **Get single customer:** `GET /api/customers/{documentId}`
- **Create sale:** `POST /api/sales`
- **Filter repair jobs by status:** `GET /api/repair-jobs?filters[status_repair][$eq]=COMPLETED`

---

For further details, see the `/docs` folder and Strapi Admin Panel Documentation plugin.
