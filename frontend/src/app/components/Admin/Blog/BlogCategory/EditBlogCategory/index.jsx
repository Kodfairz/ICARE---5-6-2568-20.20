"use client";
// ประกาศให้ Next.js รู้ว่านี่คือ Client Component

import { useState, useEffect } from "react";
// นำเข้า useState สำหรับเก็บสถานะ และ useEffect สำหรับเรียกใช้ฟังก์ชันเมื่อ component โหลด

import axios from "axios";
// นำเข้า axios สำหรับเรียก API

import { API } from "../../../../../service/api";
// นำเข้า URL พื้นฐานของ API จากไฟล์ config

// คอมโพเนนต์ EditBlogCategory รับ props 3 ตัว คือ
// onClose - ฟังก์ชันปิดโมดอล,
// onSubmit - ฟังก์ชันส่งข้อมูลเมื่อแก้ไขเสร็จ,
// id - ไอดีประเภทข้อมูลที่ต้องการแก้ไข
export default function EditBlogCategory({ onClose, onSubmit, id }) {
    // สถานะ editBlog เก็บข้อมูลประเภทข้อมูลที่จะแก้ไข (มีแค่ชื่อ)
    const [editBlog, setEditBlog] = useState({ name: "" });

    // ฟังก์ชันจัดการการส่งฟอร์ม
    const handleSubmit = (event) => {
        event.preventDefault(); // ป้องกันโหลดหน้าใหม่เมื่อส่งฟอร์ม
        onSubmit(editBlog);     // เรียกส่งข้อมูลใหม่ไปยังฟังก์ชัน onSubmit ที่รับมาจากพาเรนต์
        setEditBlog({ name: ""}); // เคลียร์ฟิลด์ข้อมูลหลังส่ง (อาจจะเลือกไม่เคลียร์ก็ได้ถ้าต้องการเก็บค่าไว้)
    };

    // ฟังก์ชันเรียก API เพื่อดึงข้อมูลประเภทบล็อกที่จะแก้ไขตาม id
    const fetchCategory = async () => {
        try {
            const response = await axios.get(`${API}/category/${id}`); // เรียกข้อมูลประเภทตาม id

            if (response.status == 200) {
                setEditBlog(response.data.resultData); // กำหนดข้อมูลที่ได้เข้า state
            }
        } catch (error) {
            console.log(error); // ถ้ามีข้อผิดพลาด ให้แสดงใน console
        }
    };

    // useEffect จะทำงานตอนแรกที่คอมโพเนนต์โหลดขึ้นมา เพื่อดึงข้อมูลประเภทที่ต้องการแก้ไข
    useEffect(() => {
        fetchCategory();
    }, []); // ใส่ dependency เป็น [] ให้ทำครั้งเดียวตอน mount

    return (
        // กล่องโมดอลแบบเต็มจอ พร้อมพื้นหลังโปร่งแสงสีดำ
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
            {/* กล่องฟอร์มแก้ไขข้อมูล สีขาว เงา มุมโค้ง และมีอนิเมชัน */}
            <div className="relative bg-white rounded-xl p-6 w-full max-w-md shadow-2xl animate-fade-in-up">
                {/* ปุ่มปิดโมดอล มุมขวาบน */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
                >
                    ×
                </button>

                {/* หัวข้อฟอร์ม */}
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    แก้ไขประเภทข้อมูล
                </h2>

                {/* ฟอร์มแก้ไขประเภทข้อมูล */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* ช่องกรอกชื่อประเภทข้อมูล */}
                    <input
                        type="text"
                        placeholder="ชื่อประเภทข้อมูล"
                        value={editBlog.name} // ค่า input มาจากสถานะ editBlog.name
                        onChange={(e) => setEditBlog({ ...editBlog, name: e.target.value })} // อัปเดตสถานะเมื่อพิมพ์
                        required
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    />

                    {/* ปุ่มแก้ไข และ ยกเลิก */}
                    <div className="flex gap-4">
                        {/* ปุ่มส่งฟอร์ม */}
                        <button
                            type="submit"
                            className="flex-1 p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300"
                        >
                            แก้ไข
                        </button>

                        {/* ปุ่มปิดโมดอล */}
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
