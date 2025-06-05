"use client"; 
// บอก Next.js ว่าโค้ดนี้จะรันฝั่ง client เท่านั้น (React component ที่ต้องการ state, effect หรือ browser API)

import { API } from "../../service/api"; 
// นำเข้า URL หรือค่า API base path จากไฟล์ service/api.js

import { useEffect, useState } from "react"; 
// นำเข้า React hook สำหรับการจัดการ state และ lifecycle

import axios from "axios"; 
// นำเข้าไลบรารี axios สำหรับเรียก API

export default function EditAdminModal({ onClose, onSubmit, idUser }) {
    // ประกาศฟังก์ชันคอมโพเนนต์ EditAdminModal ที่รับ props คือ
    // onClose - ฟังก์ชันสำหรับปิด modal
    // onSubmit - ฟังก์ชันสำหรับส่งข้อมูลเมื่อแก้ไขเสร็จ
    // idUser - รหัสผู้ใช้ที่จะแก้ไขข้อมูล

    const [newUser, setNewUser] = useState({ username: "" });
    // กำหนด state สำหรับเก็บข้อมูลผู้ใช้ใหม่ในแบบฟอร์ม (เริ่มต้นเป็น username ว่าง)

    const handleSubmit = (event) => {
        event.preventDefault(); 
        // ป้องกันการรีเฟรชหน้าเมื่อกด submit form

        onSubmit(newUser); 
        // เรียกฟังก์ชัน onSubmit ส่งข้อมูล newUser กลับไปให้ parent component

        setNewUser({ username: "" }); 
        // ล้างข้อมูลฟอร์มหลัง submit
    };

    const fetchUser = async () => {
        // ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้จาก API ตาม idUser ที่ได้รับมา
        try {
            const response = await axios.get(`${API}/users/${idUser}`);
            // เรียก API ดึงข้อมูลผู้ใช้

            if (response.status == 200) {
                setNewUser(response.data.resultData);
                // ถ้าดึงข้อมูลสำเร็จ ให้อัปเดต state newUser ด้วยข้อมูลที่ได้
            }
        } catch (error) {
            console.log(error);
            // ถ้าเกิดข้อผิดพลาด ให้แสดงใน console (สามารถปรับเพิ่มการแจ้งเตือนได้)
        }
    };

    useEffect(() => {
        fetchUser();
        // เรียกฟังก์ชัน fetchUser ครั้งแรกเมื่อ component โหลดขึ้นมา (mount)
    }, []);

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
            {/* ตัวแสดง modal ครอบคลุมหน้าจอ มีพื้นหลังสีดำโปร่งแสง */}
            <div className="relative bg-white rounded-xl p-6 w-full max-w-md shadow-2xl animate-fade-in-up">
                {/* กล่อง modal สีขาว มีขนาดจำกัด และเอฟเฟกต์ fade-in */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
                >
                    ×
                    {/* ปุ่มกดปิด modal */}
                </button>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    แก้ไขข้อมูลแอดมิน
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* ฟอร์มแก้ไขข้อมูล */}
                    <input
                        type="text"
                        placeholder="Username"
                        value={newUser.username}
                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                        // อัปเดตค่า username ใน state ทุกครั้งที่มีการพิมพ์ใน input
                        required
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    />
                    {/* ช่องกรอก username */}

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="flex-1 p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300"
                        >
                            แก้ไข
                        </button>
                        {/* ปุ่ม submit สำหรับส่งข้อมูลแก้ไข */}

                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 p-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200"
                        >
                            ยกเลิก
                        </button>
                        {/* ปุ่มกดยกเลิก ปิด modal โดยไม่ส่งข้อมูล */}
                    </div>
                </form>
            </div>
        </div>
    );
}
