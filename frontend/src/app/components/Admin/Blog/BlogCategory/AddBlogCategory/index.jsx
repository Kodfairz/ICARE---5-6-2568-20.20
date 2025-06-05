"use client";
// ประกาศให้ Next.js รู้ว่านี่เป็น Client Component (ใช้ useState, event ต่าง ๆ ได้)

import { useState } from "react";
// นำเข้า useState สำหรับเก็บสถานะในคอมโพเนนต์

// คอมโพเนนต์ AddBlogCategory รับ props 2 ตัว คือ onClose สำหรับปิดโมดอล และ onSubmit สำหรับส่งข้อมูลประเภทบล็อกใหม่
export default function AddBlogCategory({ onClose, onSubmit }) {
    // กำหนดสถานะใหม่ newBlog เป็น object ที่มี key name เริ่มต้นเป็นสตริงว่าง
    const [newBlog, setNewBlog] = useState({ name: "" });

    // ฟังก์ชัน handleSubmit ถูกเรียกตอนฟอร์มถูกส่ง (submit)
    const handleSubmit = (event) => {
        event.preventDefault(); // ป้องกันไม่ให้โหลดหน้าใหม่เมื่อส่งฟอร์ม
        onSubmit(newBlog);      // เรียกฟังก์ชัน onSubmit ที่รับเข้ามา พร้อมส่งข้อมูลประเภทบล็อกใหม่
        setNewBlog({ name: ""}); // เคลียร์ค่า input ให้ว่างหลังส่งข้อมูล
    };

    return (
        // กล่องโมดอลแบบเต็มจอ มีพื้นหลังสีดำโปร่งแสงครอบทั้งหน้าจอ
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
            {/* กล่องฟอร์มจริง อยู่ตรงกลางหน้าจอ สีขาว เงา และมีอนิเมชัน */}
            <div className="relative bg-white rounded-xl p-6 w-full max-w-md shadow-2xl animate-fade-in-up">
                {/* ปุ่มกดปิดโมดอล อยู่มุมขวาบน */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
                >
                    ×
                </button>

                {/* หัวข้อโมดอล */}
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    เพิ่มประเภทข้อมูล
                </h2>

                {/* ฟอร์มสำหรับเพิ่มประเภทข้อมูล */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* ช่องกรอกชื่อประเภทข้อมูล */}
                    <input
                        type="text"
                        placeholder="ชื่อประเภทข้อมูล"
                        value={newBlog.name} // กำหนดค่า input ตามสถานะ newBlog.name
                        onChange={(e) => setNewBlog({ ...newBlog, name: e.target.value })} // อัปเดตสถานะเมื่อพิมพ์
                        required
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    />

                    {/* ปุ่มกดเพิ่ม และ ยกเลิก */}
                    <div className="flex gap-4">
                        {/* ปุ่ม submit เพื่อเพิ่มข้อมูล */}
                        <button
                            type="submit"
                            className="flex-1 p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300"
                        >
                            เพิ่ม
                        </button>

                        {/* ปุ่มยกเลิก ปิดโมดอล */}
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 p-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200"
                        >
                            ยกเลิก
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
