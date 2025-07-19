# API Sample Payloads (Strapi v5)

ตัวอย่าง Request/Response สำหรับแต่ละ Content Type ที่สำคัญ

---

## 1. สร้าง Product (POST /api/products)
### Request
```json
{
  "data": {
    "name": "iPhone 15 Pro",
    "description": "สมาร์ทโฟนเรือธง",
    "selling_price": 42900,
    "category": "{categoryDocumentId}",
    "unit": "{unitDocumentId}"
  }
}
```
### Response (201)
```json
{
  "data": {
    "id": "clx123...",
    "attributes": {
      "name": "iPhone 15 Pro",
      "description": "สมาร์ทโฟนเรือธง",
      "selling_price": 42900,
      "createdAt": "2025-07-09T07:22:00.000Z",
      ...
    }
  }
}
```

---
## 2. GET Product (GET /api/products/{documentId})
```json
{
  "data": {
    "id": "clx123...",
    "attributes": {
      "name": "iPhone 15 Pro",
      "description": "สมาร์ทโฟนเรือธง",
      "selling_price": 42900,
      "category": { "data": { "id": "...", "attributes": { "name": "Smartphone" } } },
      "unit": { "data": { "id": "...", "attributes": { "name": "ชิ้น" } } },
      ...
    }
  }
}
```

---
## 3. สร้าง Customer (POST /api/customers)
```json
{
  "data": {
    "name": "สมชาย ใจดี",
    "phone": "0812345678",
    "email": "somchai@example.com",
    "address": "123/45 ถ.สุขุมวิท กรุงเทพฯ"
  }
}
```

---
## 4. สร้าง Purchase (POST /api/purchases)
### Request
```json
{
  "data": {
    "supplier": "{supplierDocumentId}",
    "status_purchase": "PENDING",
    "order_date": "2025-07-10T10:00:00.000Z",
    "purchase_items": [
      {
        "product": "{productDocumentId_1}",
        "quantity": 10,
        "unit_price": 850
      },
      {
        "product": "{productDocumentId_2}",
        "quantity": 5,
        "unit_price": 1200
      }
    ]
  }
}
```

---
## 5. Error Response (Validation)
```json
{
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "name must be defined",
    "details": { ... }
  }
}
```

---
## หมายเหตุ
- ทุก request ต้องห่อข้อมูลใน key `data` (Strapi v5)
- Relation ต้องใช้ documentId ของ entity ปลายทาง
- Response มีโครงสร้าง `data` (หรือ `data: []` สำหรับ list)
