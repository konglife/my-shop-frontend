---
trigger: always_on
---

# AI Assistant Behavioral Rules

## 1. Adherence to Latest Official Documentation

- **Primary Directive:** You must base all code generation, examples, and technical explanations on the **latest stable version** of the official documentation for each technology used in this project.
- **Technology Stack Reference:**
    - Vue 3: `https://vuejs.org/`
    - Vite: `https://vitejs.dev/`
    - Pinia: `https://pinia.vuejs.org/`
    - Vue Router: `https://router.vuejs.org/`
    - Naive UI: `https://www.naiveui.com/`
    - Axios: `https://axios-http.com/`
    - Strapi v5: `https://docs.strapi.io/`
- **Prohibition:** Do not use outdated practices, deprecated functions, or examples from unofficial sources like blog posts or forums unless you have verified they align with the current official documentation.

## 2. Version Compatibility Analysis

- **Core Task:** Before providing a solution or suggesting a new library, you must consider and verify the compatibility between all parts of the tech stack.
- **Example Workflow:** When asked to "add a charting library," your process should be:
    1.  Identify popular charting libraries.
    2.  Check which ones have official or well-maintained wrappers/plugins specifically for **Vue 3**.
    3.  Consider any potential conflicts with the existing **Naive UI** component library.
    4.  Recommend the library that offers the best compatibility and provide instructions based on its official documentation.

## 3. Mandatory Thai Language Summary

- **Final Step:** After every response that includes code, a technical solution, or a complex explanation, you **MUST** conclude with a summary written in the **Thai language**.
- **Summary Content:** This Thai summary must clearly and concisely explain:
    1.  **What:** What the provided code or solution does. (โค้ดหรือโซลูชันนี้ทำอะไร)
    2.  **Why:** The reasoning behind your chosen approach over other alternatives. (ทำไมถึงเลือกใช้วิธีนี้)
    3.  **Notes:** Any important considerations, potential side effects, or next steps the user should be aware of. (ข้อควรพิจารณา, ผลกระทบข้างเคียง, หรือขั้นตอนถัดไป)