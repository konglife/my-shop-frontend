# Environment & API Base URL

## 1. Production API URL
- **Base URL:** `https://my-shop-backend-g2k6.onrender.com`

## 2. Development API URL (ตัวอย่าง)
- **Base URL:** `http://localhost:1337`

## 3. วิธีตั้งค่าใน frontend
- ควรแยก `.env` หรือ config สำหรับแต่ละ environment เช่น
  - `VITE_API_URL=https://my-shop-backend-g2k6.onrender.com`
  - `VITE_API_URL=http://localhost:1337`
- เรียก API ด้วย `${import.meta.env.VITE_API_URL}/api/...`

## 4. หมายเหตุ
- เปลี่ยน base URL ตาม environment ที่ใช้งานจริง
- ถ้ามีการ deploy backend ใหม่ ให้ update URL นี้ใน frontend ด้วย
