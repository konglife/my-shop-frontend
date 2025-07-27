# Changelog

All notable changes to this project will be documented in this file.

## [2025-07-27]

### Added
- **Documentation:** Created comprehensive `CLAUDE.md` file for AI assistant guidance
  - Complete project overview with current development status
  - Detailed tech stack and architecture documentation
  - Critical development rules and backend-first principles
  - Strapi v5 API patterns and data handling guidelines
  - Established CRUD module patterns and component reusability standards
  - Recent fixes and known issues documentation

### Added
- **UI/UX (MainLayout):** Implemented modern header design with professional repair shop branding
  - Gradient background with tech-focused color scheme (purple-blue gradient)
  - Enhanced brand identity: "RepairShop Pro" with tool icon and subtitle
  - Quick action buttons for common tasks (Quick Sale, New Repair)
  - Notification center with badge counter for alerts
  - Advanced user dropdown with Profile, Settings, and Logout options
  - User avatar with initials and role display
  - Responsive design with mobile-optimized layout
  - Smooth hover animations and micro-interactions
  - Professional styling with backdrop blur and shadow effects

### Changed
- **Documentation:** Enhanced project documentation structure to include AI assistant context and development guidelines
- **Project Structure:** Cleaned up documentation files to keep only essential references
  - Removed `project_rules/` folder (content moved to CLAUDE.md)
  - Removed redundant files from `doc_frontend/` (kept API_ENDPOINTS.md, AUTH_FLOW.md, ERROR_HANDLING.md)
  - Removed `Plan_Frontend_(Vue3).md` (outdated planning document)
- **UI/UX (MainLayout):** Complete header redesign focusing on repair shop workflow efficiency
  - Increased header height from 64px to 70px for better visual hierarchy
  - Replaced simple text branding with professional icon-text combination
  - Enhanced user experience with tooltips and interactive feedback

## [2025-07-26]

### Added
- **UI/UX:** Added a "Created At" column to the categories table for better tracking.
- **UI/UX:** Added a search input and a total count summary to the `CategoriesView.vue` list page.

### Changed
- **UI/UX (Categories View):** Overhauled the design of the main category list for a more modern look and feel. This includes using a striped table, icon-based action buttons (View, Edit, Delete), and styling the ID column with tags.
- **UI/UX:** The layout of `CategoriesView.vue` has been significantly improved by moving the "Add" button and restructuring the header of the main card.
- **Features (Categories View):** Implemented server-side sorting for the ID, Name, and Created At columns.
- **UI/UX:** Updated the `MainLayout.vue` to improve the overall look and feel.
  - Constrained the main content area to a `max-width` of 1280px to prevent it from stretching on wide screens.
  - Set a light gray background color for the content layout area to create a visual distinction and a "floating" effect for the page content.
  - Ensured the content area always fills the full height of the viewport by applying a `min-height`.

### Fixed
- **Sorting (Categories View):** Fixed a `400 Bad Request` error when sorting by the ID column. The data table was sending a frontend-aliased key (`numericId`) instead of the actual API field name (`id`).
- **Type Safety:** Resolved a series of cascading TypeScript errors in `CategoriesView.vue` by correctly adapting a custom API response to the strictly-typed `StrapiResponse` expected by the `useCrud` composable.
- **API:** Corrected a critical filtering bug in `productService.getProductsByCategory` where the filter was targeting the wrong field (`documentId` instead of `id`).

## [2025-07-24]

### Added
- **Features:** Implemented a full `UnitDetailView.vue` page and added the corresponding `getUnit` function to the `unitService`.
- **Routing:** Added nested routes for the Units module, including a detail page and breadcrumb metadata.

### Changed
- **Units Module:** Refactored the entire Units module (`UnitsView.vue`) to use the centralized `useCrud.ts` composable, aligning its architecture with the Categories module.
- **Composables:** Refactored `useCrud.ts` to correctly handle the `StrapiResponse` type from services, making it compatible with the entire project.
- **UI/UX:** Refactored `CategoryDetailView.vue` to use `n-card` and `n-grid` instead of `n-descriptions`, improving the layout's readability and modernizing its appearance.

### Fixed
- **Code Quality:** Resolved numerous TypeScript errors in `UnitsView.vue` and `useCrud.ts` related to type mismatches and incorrect composable usage.
- **Code Quality:** Removed unused Naive UI component imports (`NDescriptions`, `NDescriptionsItem`, `NH3`) from `CategoryDetailView.vue`.

## [2025-07-22]

### Added
- **Features:** Implemented a full `CategoryDetailView.vue` page, allowing users to view all details of a specific category.
- **Architecture:** Developed a reusable `useCrud.ts` composable to abstract and centralize CRUD logic.
- **Components:** 
  - Created a reusable `ActionButtons.vue` component for standardized Edit/Delete actions.
  - Created `RouterPassThrough.vue` to properly handle nested routes without runtime warnings.

### Changed
- **Categories Module:** The entire module is now fully functional with Create, Read (List & Detail), Update, and Delete operations.
- **Architecture:** Refactored `CategoriesView.vue` to be the first implementation of the new `useCrud` composable.
- **Routing:** Updated `router/index.ts` with nested routes for categories and added `meta.breadcrumb` data to generate hierarchical navigation.
- **UI/UX:** 
  - Enhanced the `CategoriesView.vue` layout by wrapping the data table in an `n-card`.
  - Refactored `PageHeader.vue` to dynamically generate correct, clickable breadcrumbs from route metadata.

### Fixed
- **Editing:** Resolved a `400 Bad Request` error during category updates by ensuring only permitted data fields are sent in the payload.
- **Display:** Corrected a critical bug where category names were not displayed due to a data structure mismatch.
- **Navigation:** Fixed incorrect breadcrumb navigation on detail pages.
- **Core:** Eliminated a Vue runtime compilation warning related to inline templates in the router.
- **Code Quality:** Eliminated all TypeScript errors and warnings that arose during the refactoring.

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
