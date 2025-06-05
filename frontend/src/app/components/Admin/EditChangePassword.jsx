"use client";
// บอก Next.js ว่าโค้ดนี้จะรันบนฝั่ง client เท่านั้น (React component ที่ใช้ state และ effect)

import { API } from "../../service/api";
// นำเข้า API base URL หรือค่าคอนฟิก API จากไฟล์ภายนอก

import { useEffect, useState } from "react";
// นำเข้า React hook สำหรับจัดการ state และ lifecycle

import axios from "axios";
// นำเข้าไลบรารี axios สำหรับเรียก API

export default function EditChangePassword({ onClose, onSubmit, idUser }) {
    // ฟังก์ชันคอมโพเนนต์ EditChangePassword รับ props
    // onClose - ฟังก์ชันปิด modal
    // onSubmit - ฟังก์ชันส่งข้อมูลรหัสผ่านใหม่
    // idUser - รหัสผู้ใช้ที่จะแก้ไขรหัสผ่าน

    const [user, setUser] = useState({ username: "", password: "", newPassword: "" });
    // กำหนด state สำหรับเก็บข้อมูลผู้ใช้ ได้แก่ username, password เดิม และรหัสผ่านใหม่

    const handleSubmit = (event) => {
        event.preventDefault();
        // ป้องกันการรีเฟรชหน้าตอน submit form

        onSubmit(user);
        // เรียกฟังก์ชัน onSubmit ส่งข้อมูล user ที่ประกอบด้วย password เดิมและรหัสผ่านใหม่กลับไปยัง parent component

        setUser({ password: "", newPassword: "" });
        // ล้างข้อมูลรหัสผ่านในฟอร์มหลังส่งข้อมูล
    };

    const fetchUser = async () => {
        // ฟังก์ชันดึงข้อมูลผู้ใช้ตาม idUser จาก API
        try {
            const response = await axios.get(`${API}/users/${idUser}`);
            // เรียก API เพื่อดึงข้อมูลผู้ใช้

            if (response.status == 200) {
                setUser(response.data.resultData);
                // ถ้าข้อมูลถูกดึงมาได้สำเร็จ ให้ตั้งค่า user state ด้วยข้อมูลที่ได้
            }
        } catch (error) {
            console.log(error);
            // แสดง error ใน console หากเกิดปัญหาในการดึงข้อมูล
        }
    };

    useEffect(() => {
        fetchUser();
        // เมื่อ component โหลดครั้งแรก (mount) ให้เรียกฟังก์ชัน fetchUser เพื่อดึงข้อมูลผู้ใช้
    }, []);

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
            {/* modal overlay คลุมทั้งหน้าจอ มีพื้นหลังสีดำโปร่งแสง */}
            <div className="relative bg-white rounded-xl p-6 w-full max-w-md shadow-2xl animate-fade-in-up">
                {/* กล่อง modal สีขาว มีขนาดจำกัดและเอฟเฟกต์ fade-in */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
                >
                    ×
                    {/* ปุ่มปิด modal */}
                </button>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    แก้ไขรหัสผ่าน
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* ฟอร์มสำหรับกรอกข้อมูลรหัสผ่าน */}

                    <input
                        type="text"
                        placeholder="Username"
                        value={user.username || ""}
                        readOnly
                        // ช่อง username แสดงข้อมูลผู้ใช้แบบอ่านอย่างเดียว (ไม่แก้ไขได้)
                        onChange={(e) => setUser({ ...user, username: e.target.value })}
                        // ถึงมี onChange แต่เพราะ readonly เลยไม่สามารถเปลี่ยนค่าได้จริง
                        required
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    />

                    <input
                        type="password"
                        placeholder="รหัสผ่านเก่า"
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                        // อัปเดตรหัสผ่านเดิมใน state ทุกครั้งที่พิมพ์
                        required
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    />

                    <input
                        type="password"
                        placeholder="รหัสผ่านใหม่"
                        onChange={(e) => setUser({ ...user, newPassword: e.target.value })}
                        // อัปเดตรหัสผ่านใหม่ใน state ทุกครั้งที่พิมพ์
                        required
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    />

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="flex-1 p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300"
                        >
                            แก้ไข
                        </button>
                        {/* ปุ่ม submit เพื่อส่งข้อมูล */}

                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 p-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200"
                        >
                            ยกเลิก
                        </button>
                        {/* ปุ่มปิด modal โดยไม่ส่งข้อมูล */}
                    </div>
                </form>
            </div>
        </div>
    );
}
