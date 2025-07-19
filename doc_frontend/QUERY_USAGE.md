# Query Parameters Usage (Strapi v5)

## 1. Filter
- `/api/products?filters[name][$contains]=iPhone`
- `/api/sales?filters[status_sale][$eq]=COMPLETED`

## 2. Pagination
- `/api/products?pagination[page]=1&pagination[pageSize]=10`

## 3. Sorting
- `/api/products?sort=selling_price:desc`

## 4. Populate Relations
- `/api/products?populate=*` (populate ทุก relation)
- `/api/products?populate=category,unit,stock`
- `/api/repair-jobs?populate=used_parts`

## 5. ค้นหาด้วย Numeric id (Strapi v5)
- `/api/products?filters[id][$eq]=1`

## 6. รวมตัวอย่าง
- `/api/products?filters[name][$contains]=iPhone&sort=selling_price:desc&pagination[page]=1&pagination[pageSize]=5&populate=*`
