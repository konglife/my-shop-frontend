# Changelog

All notable changes to this project will be documented in this file.

## [2025-07-20]

### Completed
- **Sales Module (`SalesView.vue`, `SaleDetailView.vue`):**
  - Completed the full implementation of the sales creation and detail views.
  - Resolved all persistent lint errors and stabilized the components for testing.
- **Categories Module (`CategoriesView.vue`, `CategoryFormModal.vue`):**
  - Fixed a critical runtime error by adding the required `<n-dialog-provider>` to `App.vue`, enabling confirmation dialogs.
  - Corrected a Vue 3 error in `CategoryFormModal.vue` by replacing `v-model` on a prop with the correct `:show` and `@update:show` pattern.

### Pending Issues
- **Categories View (`CategoriesView.vue`):**
  - The "Name" column in the data table is currently not displaying the category name from the API. This needs to be fixed by correcting the data key in the column definition.

## [Unreleased]

### Changed
- **Products View (`ProductsView.vue`):**
  - Refactored the product data table to be fully responsive and standardized.
  - Removed all explicit `width` and `fixed` column properties to allow for automatic, content-based column sizing.
  - Simplified the column definition logic, removing separate configurations for mobile and desktop to create a consistent experience across all devices.
  - Cleaned up the component by removing unused variables and imports related to responsive breakpoints (`isMobile`, `useBreakpoints`).

### Added
- **UI/UX Overhaul:** Began refactoring the main layout for responsiveness and improved user experience.
- **Product Module:** Implemented initial product listing page with data fetching from the backend.
- **Strapi Utilities:** Created a query builder for easier API communication.
- **Core Views:** Created placeholder views for all main modules (Dashboard, Products, Sales, Repairs).
- **Authentication Flow:**
  - Implemented a complete login/logout flow using Pinia for state management.
  - Created `LoginView.vue` and `MainLayout.vue`.
  - Set up route guards to protect authenticated routes.
- **Project Foundation:**
  - Initialized Vue 3 + Vite + TypeScript project.
  - Configured Axios, Pinia with persistence, Vue Router, and Naive UI.
  - Established a comprehensive `README.md`.
