# CLAUDE.md - Repair Shop Management System Frontend

## Project Overview

This is a **Vue 3 + TypeScript** frontend application for a Repair Shop Management System, built to work with a **Strapi v5** backend. The application uses modern Vue 3 Composition API with `<script setup>` syntax and follows strict architectural principles.

## Tech Stack

- **Frontend Framework:** Vue 3 with Composition API and `<script setup>`
- **State Management:** Pinia with persisted state
- **Routing:** Vue Router 4
- **HTTP Client:** Axios with centralized API service
- **UI Components:** Naive UI library
- **Language:** TypeScript
- **Build Tool:** Vite
- **Backend:** Strapi v5 (pre-built)

## Current Development Status

### ✅ Completed Features

#### Core Infrastructure (2025-07-20 to 2025-07-26)
- **Authentication System:** Login functionality with JWT token management
- **Main UI Layout:** Core application structure with improved responsive design
  - Constrained main content to max-width 1280px for wide screens
  - Light gray background with "floating" content effect
  - Full viewport height layout
- **API Integration:** Centralized Axios service with interceptors
- **State Management:** Pinia stores with persistence
- **Error Handling:** Standardized error handling patterns

#### Reusable Architecture Components
- **`useCrud.ts` Composable:** Centralized CRUD logic with StrapiResponse handling
- **`DataTableWrapper.vue`:** Reusable component for loading/empty/error states
- **`ActionButtons.vue`:** Standardized Edit/Delete action buttons
- **`RouterPassThrough.vue`:** Proper nested route handling without warnings
- **Enhanced `PageHeader.vue`:** Dynamic breadcrumb generation from route metadata

#### Categories Module (Complete CRUD)
- **List View:** Modern striped table with search, sorting, and total count
- **Detail View:** Full category details using n-card and n-grid layout
- **Create/Edit:** Modal-based forms with validation
- **Server-side Sorting:** ID, Name, and Created At columns
- **Search Functionality:** Real-time category filtering
- **Action Buttons:** Icon-based View/Edit/Delete with confirmation dialogs

#### Units Module (Complete CRUD)
- **List View:** Refactored to use useCrud composable architecture
- **Detail View:** Full unit detail page with proper routing
- **Nested Routing:** Detail pages with breadcrumb navigation

#### Sales Module (Completed - 2025-07-20)
- **Sales Creation View:** Complete implementation
- **Sale Detail View:** Full sales detail functionality
- **Stabilized Components:** All lint errors resolved

### 🚧 In Development
- Further improvements to existing modules before moving to new features
- Focus on enhancing current implementations rather than adding new modules

## Key Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Type checking
npm run preview
```

## Backend API Configuration

### Base URL
- **Production:** `https://my-shop-backend-g2k6.onrender.com`
- **Environment Variable:** `VITE_API_URL`

### Authentication
- **Login:** `POST /api/auth/local`
- **JWT Header:** `Authorization: Bearer {token}`

## Critical Development Rules

### 1. Backend-First Principle
- **Backend is the single source of truth** for all business logic
- Frontend acts as a "remote control" - triggers backend processes via status changes
- **Never calculate** stock levels, costs, or complex validations on frontend
- Always fetch updated data after successful operations

### 2. Strapi v5 API Patterns

#### Important: documentId vs Numeric ID
- Single entry operations use **string `documentId`**: `GET /api/products/{documentId}`
- For numeric ID queries use filters: `GET /api/products?filters[id][$eq]=1`

#### Request/Response Structure
```javascript
// POST/PUT requests MUST wrap data
{
  "data": {
    "name": "Product Name",
    "selling_price": 100
  }
}

// Responses wrap data
{
  "data": { /* single item */ }
}
// or
{
  "data": [ /* array for lists */ ]
}
```

#### Query Parameters
- **Populate relations:** `populate=*` or `populate=category,unit`
- **Filtering:** `filters[name][$contains]=iPhone`
- **Sorting:** `sort=name:asc`
- **Pagination:** `pagination[page]=1&pagination[pageSize]=10`

### 3. Auto-Managed Fields (Read-Only)
Never send these fields in POST/PUT requests:
- `id`, `documentId`, `createdAt`, `updatedAt`
- `Stock.quantity`, `Stock.average_cost`
- `SaleItem.price_at_time`, `SaleItem.cost_at_time`
- `RepairJob.parts_cost`, `RepairJob.labor_cost`

### 4. Status-Driven Business Logic
Trigger backend processes by changing entity status:

```javascript
// Example: Receive purchase items
PUT /api/purchases/{documentId}
{
  "data": {
    "status_purchase": "RECEIVED"
  }
}
// Backend automatically updates stock quantities and costs
```

## Content Types & Relations

### Core Entities
- **CATEGORY:** `name` (required)
- **CUSTOMER:** `name` (required), `phone`, `email`, `address`
- **PRODUCT:** `name` (required), `description`, `selling_price` (required)
- **UNIT:** `name` (required)
- **SUPPLIER:** `name` (required), `contact_person`, `phone`, `email`

### Business Entities
- **STOCK:** `quantity`, `min_quantity`, `average_cost`
- **PURCHASE:** `status_purchase`, `order_date`, `received_date`
- **PURCHASE_ITEM:** `quantity` (required), `unit_price` (required)
- **SALE:** `total_amount`, `total_cost`, `status_sale`
- **SALE_ITEM:** `quantity` (required), `price_at_time`, `cost_at_time`
- **REPAIR_JOB:** `name` (required), `description`, `status_repair`, `total_cost` (required)
- **USED_PART:** `quantity` (required), `cost_at_time`

## Error Handling

```javascript
// Expected error structure
{
  "error": {
    "status": 400,
    "name": "ValidationError", 
    "message": "Error details"
  }
}

// Handle 401/403 → redirect to login
```

## Code Standards

### Vue 3 Composition API
- Use `<script setup>` syntax
- Leverage Vue 3 reactivity system
- Follow official Vue 3 documentation patterns

### Component Structure
```vue
<script setup lang="ts">
// Imports
// Interface definitions
// Props/emits
// Reactive state
// Computed properties
// Methods
// Lifecycle hooks
</script>

<template>
  <!-- Naive UI components -->
</template>

<style scoped>
  /* Component styles */
</style>
```

### TypeScript Usage
- Define interfaces for all API responses
- Type all props, emits, and reactive state
- Use strict TypeScript configuration

### Naive UI Integration
- Use Naive UI components exclusively for UI elements
- Follow Naive UI theming and customization patterns
- Leverage built-in form validation and data display components

## File Structure Guidelines

```
src/
├── components/     # Reusable components
├── views/         # Page components
├── stores/        # Pinia stores
├── services/      # API services
├── types/         # TypeScript interfaces
├── router/        # Vue Router configuration
└── utils/         # Utility functions
```

## Development Workflow

1. **Plan tasks** using appropriate planning tools
2. **Research codebase** to understand existing patterns
3. **Follow existing conventions** and component patterns
4. **Test functionality** thoroughly
5. **Run type checking** before committing
6. **Only commit when explicitly requested**

## Key Architecture Patterns Established

### CRUD Module Pattern
All data modules follow this established pattern:
- **List View:** Uses `useCrud` composable with `DataTableWrapper`
- **Detail View:** Individual item display with proper routing
- **Forms:** Modal-based create/edit with validation
- **Actions:** Standardized `ActionButtons` component
- **Routing:** Nested routes with breadcrumb metadata

### Component Reusability
- **`useCrud.ts`:** Handles all CRUD operations with type safety
- **`DataTableWrapper.vue`:** Standard loading/empty/error states
- **`ActionButtons.vue`:** Consistent Edit/Delete button styling
- **`PageHeader.vue`:** Dynamic breadcrumbs from route metadata

### Recent Critical Fixes (2025-07-26)
- **Sorting Bug:** Fixed 400 error when sorting by ID (frontend alias vs API field)
- **Type Safety:** Resolved TypeScript cascading errors in StrapiResponse handling
- **API Filtering:** Corrected `documentId` vs `id` filtering in product services

## Thai Language Requirement

After technical solutions or complex explanations, provide a Thai summary covering:
1. **สิ่งที่โค้ดทำ** (What the code does)
2. **เหตุผลในการเลือกวิธีนี้** (Why this approach was chosen)
3. **ข้อควรพิจารณา** (Important considerations or next steps)

---

**Note:** This project follows strict backend-first principles where the Strapi backend handles all business logic. The frontend's role is to provide an intuitive interface for triggering and displaying these backend processes.