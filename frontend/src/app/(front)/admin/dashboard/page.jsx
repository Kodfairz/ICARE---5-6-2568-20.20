"use client"; 
// ประกาศให้ Next.js รู้ว่านี่คือ Client Component ที่รันบนฝั่งผู้ใช้

import { useState } from "react"; 
// นำเข้า React hook useState สำหรับเก็บสถานะของแท็บที่ถูกเลือก

import AdminList from "../../../components/Admin/AdminList";
import BlogManagement from "../../../components/Admin/Blog/BlogManagement";
import CategoryBlog from "../../../components/Admin/Blog/BlogCategory";
import Comment from "../../../components/Admin/Comment";
import VideoManagement from "../../../components/Admin/Video/VideoManagement";
// นำเข้า Component ย่อยแต่ละส่วนของแดชบอร์ด เพื่อแสดงผลตามแท็บที่เลือก

export default function AdminDashboard() {
  // สร้างฟังก์ชันคอมโพเนนต์หลักสำหรับแดชบอร์ดผู้ดูแลระบบ
  const [activeTab, setActiveTab] = useState("แอดมิน");
  // กำหนดสถานะ activeTab โดยเริ่มต้นเป็น "แอดมิน" เพื่อกำหนดแท็บเริ่มต้นที่แสดง

  return (
    <div className="container mx-auto p-6 min-h-screen ">
      {/* Container หลัก จัดตำแหน่งกลางจอ มี padding รอบขอบ และความสูงขั้นต่ำเต็มหน้าจอ */}
      <h1 className="text-4xl font-bold text-gray-800 mb-8 animate-fade-in-down">
        แดชบอร์ด
      </h1>
      {/* หัวข้อหลักของหน้าด้วยขนาดตัวอักษรใหญ่ สีเทาเข้ม และมี margin ด้านล่าง + animation */}

      {/* Tab Navigation */}
      <nav className="flex flex-wrap gap-2 mb-8 border-b border-gray-200">
        {/* แถบเมนูแท็บ จัดเรียงแนวนอน มีช่องว่างระหว่างปุ่ม และเส้นขอบล่าง */}
        {["แอดมิน", "ข่าวสาร", "วิดีโอ", "ประเภทข้อมูล", "ข้อเสนอแนะ"].map((tab) => (
          // วนลูปสร้างปุ่มแท็บจากอาร์เรย์ชื่อแท็บ
          <button
            key={tab} // ใส่ key ให้แต่ละปุ่มเพื่อช่วย React จัดการ rendering
            onClick={() => setActiveTab(tab)} // เมื่อคลิกเปลี่ยนสถานะแท็บที่เลือก
            className={`px-6 py-3 text-lg font-medium capitalize rounded-t-lg transition-all duration-300 ${
              activeTab === tab
                ? "bg-white text-indigo-600 border-b-4 border-indigo-600" 
                // ถ้าแท็บนี้ถูกเลือก เปลี่ยนสีพื้นหลังเป็นขาว ตัวอักษรสีฟ้าเข้ม และมีเส้นขอบล่างหนา 4px
                : "text-gray-600 hover:bg-gray-100 hover:text-indigo-500"
                // ถ้าไม่ได้เลือก ให้ตัวอักษรสีเทา และเมื่อ hover จะเปลี่ยนพื้นหลังและสีตัวอักษร
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Tab Content */}
      <section className="bg-white rounded-xl shadow-lg p-6 animate-fade-in">
        {/* ส่วนแสดงเนื้อหาแท็บ มีพื้นหลังสีขาว ขอบมน มีเงา และ padding + animation */}
        {activeTab === "แอดมิน" && <AdminList />}
        {activeTab === "ข่าวสาร" && <BlogManagement />}
        {activeTab == "วิดีโอ" && <VideoManagement />}
        {activeTab === "ประเภทข้อมูล" && <CategoryBlog />}
        {activeTab === "ข้อเสนอแนะ" && <Comment />}
        {/* แสดงคอมโพเนนต์ย่อยตามแท็บที่ถูกเลือก */}
      </section>
    </div>
  );
}
