"use client"; 
// ประกาศว่า component นี้ทำงานบน client side (ใน browser) ไม่ใช่ server side

import { useState } from "react"; 
// import useState hook สำหรับเก็บสถานะใน component

// ประกาศฟังก์ชันคอมโพเนนต์ AddAdminModal ซึ่งรับ props 2 ตัวคือ onClose และ onSubmit
export default function AddAdminModal({ onClose, onSubmit }) {
    // สร้าง state เก็บข้อมูลผู้ใช้ใหม่ โดยเริ่มจาก username และ password เป็นค่าว่าง
    const [newUser, setNewUser] = useState({ username: "", password: "" });

    // ฟังก์ชันจัดการเมื่อ submit ฟอร์ม
    const handleSubmit = (event) => {
        event.preventDefault(); // ป้องกันไม่ให้หน้าเว็บรีเฟรชตามปกติของฟอร์ม
        onSubmit(newUser); // เรียกฟังก์ชัน onSubmit ที่ส่งมาจาก props พร้อมข้อมูลผู้ใช้ใหม่
        setNewUser({ username: "", password: "" }); // เคลียร์ข้อมูลฟอร์มให้ว่างหลังส่งข้อมูลแล้ว
    };

    return (
        // กล่อง modal ครอบเต็มหน้าจอ
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
            {/* กล่องเนื้อหา modal */}
            <div className="relative bg-white rounded-xl p-6 w-full max-w-md shadow-2xl animate-fade-in-up">
                {/* ปุ่มกากบาท ปิด modal */}
                <button
                    onClick={onClose} // เมื่อคลิกเรียก onClose จาก props เพื่อปิด modal
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
                >
                    ×
                </button>

                {/* หัวข้อ modal */}
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    เพิ่มข้อมูลแอดมิน
                </h2>

                {/* ฟอร์มเพิ่มแอดมิน */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* ช่องกรอก username */}
                    <input
                        type="text"
                        placeholder="Username"
                        value={newUser.username} // ผูกค่า input กับ state newUser.username
                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} 
                        // เมื่อเปลี่ยนแปลง input จะอัปเดต state โดยไม่ลบค่าอื่น ๆ (spread operator ...)
                        required // กำหนดให้ช่องนี้ต้องกรอก
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    />
                    {/* ช่องกรอก password */}
                    <input
                        type="password"
                        placeholder="Password"
                        value={newUser.password} // ผูกค่า input กับ state newUser.password
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        required
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    />
                    {/* ปุ่ม เพิ่ม และ ปุ่ม ลบ (ปิด modal) */}
                    <div className="flex gap-4">
                        {/* ปุ่ม submit ฟอร์ม */}
                        <button
                            type="submit"
                            className="flex-1 p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300"
                        >
                            เพิ่ม
                        </button>
                        {/* ปุ่มกดเพื่อปิด modal */}
                        <button
                            type="button"
                            onClick={onClose} // ปิด modal
                            className="flex-1 p-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200"
                        >
                            ลบ
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
