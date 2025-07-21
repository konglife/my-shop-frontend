# Changelog

All notable changes to this project will be documented in this file.

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
