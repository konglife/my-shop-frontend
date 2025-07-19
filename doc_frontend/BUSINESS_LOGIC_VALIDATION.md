# Business Logic & Validation (Strapi v5)

## 1. ฟิลด์ที่คำนวณอัตโนมัติ/จัดการโดย backend
- Stock: average_cost, quantity (บางกรณี), parts_cost, labor_cost (ใน RepairJob)
- SaleItem: price_at_time, cost_at_time (set อัตโนมัติจาก product/stock)
- Supplier: phone (format อัตโนมัติเป็น E.164)

## 2. Validation (ตัวอย่าง)
- ฟิลด์ required: name, selling_price (Product), quantity (SaleItem)
- Enum: status_purchase (Purchase), status_sale (Sale), status_repair (RepairJob)
- Email/phone: ตรวจสอบรูปแบบโดยอัตโนมัติ

## 3. Readonly/Auto fields (frontend ไม่ต้องส่ง)
- createdAt, updatedAt, id, documentId
- ฟิลด์ที่คำนวณอัตโนมัติ (ดูข้อ 1)

## 4. หมายเหตุ
- Validation เพิ่มเติมอาจอยู่ใน lifecycles.js ของแต่ละ content type
- หาก validation ไม่ผ่าน จะได้ error 400 พร้อมรายละเอียด
