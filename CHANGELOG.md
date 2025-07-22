# Changelog

All notable changes to this project will be documented in this file.

## [2025-07-22]

### Added
- **Architecture:** Developed a reusable `useCrud.ts` composable to abstract and centralize CRUD logic.
- **Components:** Created a reusable `ActionButtons.vue` component for standardized Edit/Delete actions in data tables.

### Changed
- **Architecture:** Refactored `CategoriesView.vue` to be the first implementation of the new `useCrud` composable, significantly simplifying its state management and data-handling logic.
- **UI/UX:** Enhanced the `CategoriesView.vue` layout by wrapping the data table in an `n-card` for better visual structure.
- **Types:** Updated `strapi.ts` types to more accurately reflect the Strapi v5 API structure, particularly the use of a string-based `id` as the primary document identifier.

### Fixed
- **Categories View:** Corrected a critical bug where category names were not displayed. This was caused by a mismatch between the custom flattened API response and the data structure expected by the frontend. The issue was resolved by creating a `serviceAdapter` to transform the data into a standard format before processing.
- **Code Quality:** Eliminated all TypeScript errors and warnings that arose during the refactoring of `useCrud.ts` and `CategoriesView.vue`.

## [2025-07-21]

### Changed
- **Architecture:** Created a reusable `DataTableWrapper.vue` component to handle loading, empty, and error states automatically.
- **Categories View (`CategoriesView.vue`):** Refactored the view to use the new `DataTableWrapper`, significantly simplifying its template and script.

### Fixed
- **Categories View (`CategoriesView.vue`):**
  - Fixed an issue where the category name was not displaying in the data table.
  - Corrected the column's `key` to match the actual flattened data structure returned by the API.
  - Introduced a local `FlatCategory` type and refactored the component to use it, resolving all related TypeScript errors and warnings.

## [2025-07-20]

### Completed
- **Sales Module (`SalesView.vue`, `SaleDetailView.vue`):**
  - Completed the full implementation of the sales creation and detail views.
  - Resolved all persistent lint errors and stabilized the components for testing.
- **Categories Module (`CategoriesView.vue`, `CategoryFormModal.vue`):**
  - Fixed a critical runtime error by adding the required `<n-dialog-provider>` to `App.vue`, enabling confirmation dialogs.
  - Corrected a Vue 3 error in `CategoryFormModal.vue` by replacing `v-model` on a prop with the correct `:show` and `@update:show` pattern.
