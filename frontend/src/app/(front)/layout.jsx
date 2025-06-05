import React from 'react'
// นำเข้า React ซึ่งจำเป็นสำหรับสร้างคอมโพเนนต์ (ใน Next.js 13+ บางครั้งอาจไม่ต้อง import ก็ได้)

import Navbar from '../components/Navbar'
// นำเข้า Navbar component จากโฟลเดอร์ components เพื่อใช้แสดงเมนูนำทางในเลย์เอาต์

// สร้างฟังก์ชันคอมโพเนนต์ layout ที่รับ props children (คือเนื้อหาย่อยที่จะถูกแสดงในเลย์เอาต์นี้)
const layout = ({ children }) => {
  return (
    <>
      {/* แสดง Navbar อยู่ด้านบนเสมอ */}
      <Navbar />
      
      {/* แสดงเนื้อหาย่อยที่ส่งเข้ามาในเลย์เอาต์นี้ */}
      {children}
    </>
  )
}

export default layout
// ส่งออกคอมโพเนนต์ layout เพื่อให้ไฟล์อื่นนำไปใช้งานได้
