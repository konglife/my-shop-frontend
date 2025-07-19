**แผนการพัฒนา Frontend (Vue 3\) สำหรับระบบจัดการร้าน**

**เป้าหมายหลัก:** สร้าง Frontend Application ด้วย Vue 3 เพื่อเป็น "รีโมทคอนโทรล" ที่ใช้งานง่ายสำหรับจัดการข้อมูลบน Backend Strapi ที่มีอยู่แล้ว โดยเน้นการทำงานสำหรับผู้ใช้คนเดียว (คือตัวคุณเอง) และยึดตาม Business Logic ที่กำหนดไว้ในเอกสารทั้งหมด

---

#### **Phase 1: วางรากฐานโปรเจกต์และส่วนกลาง (Core & Foundation)**

ส่วนนี้คือการตั้งค่าพื้นฐานที่จำเป็นสำหรับทุกโมดูล

1. **ตั้งค่าโปรเจกต์ (Project Setup):**  
   * Vue 3 \+ Vite พร้อมเลือก TypeScript.  
   * ติดตั้งและตั้งค่า Library ที่จำเป็น: Vue Router (สำหรับจัดการหน้า), Pinia (สำหรับจัดการ State), Axios (สำหรับยิง API), และ Naive UI (สำหรับ Components).  
2. **สร้างโครงสร้างหน้าหลัก (Layout & Routing):**  
   * สร้าง Layout หลัก: Sidebar (เมนูนำทาง), Header (อาจมีข้อมูล User), และส่วนแสดงเนื้อหาหลัก (Content Area).  
   * กำหนด Routes ใน Vue Router สำหรับหน้าต่างๆ ที่จะสร้างในเฟสถัดไป (เช่น /dashboard, /products, /sales, /repairs).  
3. **สร้าง API Service Layer (หัวใจของการสื่อสาร):**  
   * สร้าง apiClient ด้วย axios ที่มี Interceptor สำหรับแนบ Bearer Token จาก Pinia โดยอัตโนมัติในทุก Request.  
   * สร้าง Query Helper ที่เป็นฟังก์ชันสำหรับช่วยสร้าง query string ของ Strapi (เช่น populate, filters, sort) เพื่อให้เรียกใช้ใน Service ได้ง่าย.  
4. **การยืนยันตัวตน (Authentication):**  
   * สร้างหน้า Login ที่รับ identifier และ password เพื่อยิงไปที่ POST /api/auth/local.  
   * เมื่อ Login สำเร็จ ให้เก็บ jwt และ user ไว้ใน Pinia Store และ Redirect ไปยังหน้า Dashboard.  
   * ตั้งค่า Navigation Guards ใน Vue Router เพื่อป้องกันไม่ให้เข้าถึงหน้าที่ต้อง Login ก่อน.

---

#### **Phase 2: โมดูลจัดการสินค้าคงคลัง (Inventory Module)**

นี่คือโมดูลที่ใหญ่และสำคัญที่สุด มี Workflow ที่เชื่อมโยงกันหลายส่วน.

1. **จัดการข้อมูล Master (Products, Categories, Suppliers):**  
   * สร้างหน้า List สำหรับแสดงรายการ Products (ใช้ตารางของ Naive UI) พร้อมระบบ **Search, Filter, และ Pagination** โดยเรียกใช้ GET /api/products.  
   * สร้างฟอร์ม (Modal/Popup) สำหรับ **Create/Edit** Products, Categories, Suppliers ซึ่งจะเรียกใช้ POST และ PUT API endpoints ที่เกี่ยวข้อง.  
2. **จัดการใบสั่งซื้อ (Purchases Workflow):**  
   * สร้างหน้า List สำหรับแสดง Purchases ทั้งหมด (GET /api/purchases).  
   * สร้างหน้าฟอร์มสำหรับ **"สร้างใบสั่งซื้อใหม่"** ซึ่งต้องสามารถ...  
     * เลือก Supplier จาก Dropdown.  
     * เพิ่ม PurchaseItem เข้าไปในรายการได้แบบ Dynamic (เลือก Product และใส่ quantity, unit\_price).  
   * **Workflow สำคัญ:** ในหน้ารายละเอียดใบสั่งซื้อ ต้องมีปุ่ม/Action สำหรับ **"รับสินค้า (Receive)"**. เมื่อกดปุ่มนี้ จะยิง PUT /api/purchases/{id} เพื่อเปลี่ยน status\_purchase เป็น RECEIVED. **Frontend ไม่ต้องคำนวณสต็อกหรือ Average Cost เอง** แต่ต้องแสดงผล Stock ที่อัปเดตแล้วหลังจากยิง API สำเร็จ.

---

#### **Phase 3: โมดูลการขายและงานซ่อม (Sales & Repairs Modules)**

สองโมดูลนี้มี Logic การ "ตัดสต็อก" ที่ขับเคลื่อนด้วย status.

1. **จัดการการขาย (Sales Workflow):**  
   * สร้างหน้าฟอร์ม "สร้างการขาย" ที่สามารถเพิ่ม SaleItem ได้แบบ Dynamic.  
   * ฟอร์มต้องสามารถบันทึกเป็น DRAFT หรือ COMPLETED ได้.  
   * **Workflow สำคัญ:** การเปลี่ยนสถานะเป็น COMPLETED (ไม่ว่าจะตอนสร้างหรืออัปเดต) คือการสั่งให้ Backend **ตัดสต็อก**. Frontend ต้องแสดงสถานะปัจจุบันและมี UI ให้สามารถอัปเดตได้.  
2. **จัดการงานซ่อม (Repairs Workflow):**  
   * สร้างหน้า List สำหรับ RepairJobs.  
   * สร้าง **"หน้ารายละเอียดงานซ่อม"** ซึ่งเป็นหน้าหลักในการทำงานของโมดูลนี้:  
     * แสดงข้อมูลหลักของ RepairJob และ Customer ที่เกี่ยวข้อง.  
     * มี UI สำหรับ **เพิ่ม/ลบ UsedPart (อะไหล่ที่ใช้)** โดยจะต้องยิงไปที่ Custom Endpoint (POST /api/repair-jobs/{id}/parts และ DELETE .../{partId}). **Frontend ไม่ต้องคำนวณ parts\_cost เอง** แต่จะแสดงผลที่ Backend คำนวณกลับมาให้.  
     * มี Input field สำหรับกรอก total\_cost.  
     * **Workflow สำคัญ:** มี UI สำหรับเปลี่ยน status\_repair เป็น COMPLETED เพื่อสั่งให้ Backend **คำนวณ labor\_cost และตัดสต็อกอะไหล่**.

---

#### **Phase 4: โมดูลลูกค้าและภาพรวม (Customers & Dashboard)**

ส่วนสุดท้ายเพื่อทำให้ระบบสมบูรณ์

1. **จัดการลูกค้า (Customers):**  
   * สร้างหน้า CRUD มาตรฐานสำหรับ Customers (List, Create, Edit) ตาม API Specification.  
   * ในหน้ารายละเอียดลูกค้า อาจมีการดึงข้อมูลประวัติการซ่อมและการขายมาแสดง (ใช้ populate หรือยิง API แยก).  
2. **สร้าง Dashboard:**  
   * สร้างหน้า Dashboard ที่ดึงข้อมูลจากหลายๆ ส่วนมาสรุปผล (ตามแนวทาง "ทำใน frontend ก่อน").  
   * เช่น: ดึงข้อมูล Sales และ Purchases ของเดือนล่าสุดมาคำนวณยอดรวม, ดึง RepairJobs ที่มีสถานะ IN\_PROGRESS มาแสดง.  
   * ใช้ Chart.js หรือ ECharts เพื่อแสดงผลเป็นกราฟ.

**แผนนี้จะช่วยให้คุณเห็นภาพรวมทั้งหมดและสามารถแบ่งงานเป็นชิ้นเล็กๆ เพื่อสั่งให้ AI Assistants ช่วยเขียนโค้ดในแต่ละส่วนได้อย่างชัดเจนครับ เริ่มจาก Phase 1 ก่อน แล้วค่อยๆ ต่อเติมไปทีละโมดูลได้เลย**