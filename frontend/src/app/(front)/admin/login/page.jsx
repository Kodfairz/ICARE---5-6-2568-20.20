"use client";
// ประกาศให้ Next.js รู้ว่านี่คือ Client Component ที่รันฝั่งผู้ใช้

import { useState } from "react";
// นำเข้า useState สำหรับเก็บสถานะภายในคอมโพเนนต์
import { useRouter } from "next/navigation";
// นำเข้า useRouter สำหรับการเปลี่ยนเส้นทาง (redirect)
import axios from "axios";
// นำเข้า axios สำหรับเรียก API
import { API } from "../../../service/api";
// นำเข้าค่าคงที่ API endpoint จากไฟล์ config
import { toast } from "react-toastify";
// นำเข้า toast สำหรับแสดงข้อความแจ้งเตือนแบบ popup
import Cookies from "js-cookie";
// นำเข้า js-cookie สำหรับจัดการ cookie

export default function Login() {
  const expireTimeInDays = 20 / 24;
  // กำหนดเวลาหมดอายุ cookie เป็น 20 ชั่วโมง (20/24 วัน)
  
  // สถานะเก็บข้อมูล username, password และสถานะ loading
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  // เรียกใช้ useRouter เพื่อใช้ฟังก์ชันเปลี่ยนหน้า

  // ฟังก์ชันจัดการเมื่อกด submit ฟอร์ม
  const handleSubmit = async (event) => {
    event.preventDefault();
    // ป้องกันการรีเฟรชหน้าเมื่อ submit ฟอร์ม
    setLoading(true);
    // เปลี่ยนสถานะเป็นกำลังโหลด

    try {
      // เรียก API POST /users/login ส่ง username, password
      const response = await axios.post(`${API}/users/login`, {
        username,
        password,
      });

      if (response.status === 200) {
        // ถ้า login สำเร็จ
        // เก็บ token ลง cookie พร้อมกำหนดเวลาหมดอายุ
        Cookies.set("token", response.data.token, { expires: expireTimeInDays });
        // เก็บข้อมูลผู้ใช้ใน cookie เป็น JSON string
        Cookies.set("user", JSON.stringify(response.data.resultData), { expires: expireTimeInDays });
        toast.success("เข้าสู่ระบบสำเร็จ!");
        // แสดงข้อความแจ้งเตือนสำเร็จ

        window.dispatchEvent(new Event("loginStatusChanged"));
        // ส่ง event แจ้งให้แอปพลิเคชันรู้ว่ามีการ login เปลี่ยนแปลงสถานะ

        router.push("/admin/dashboard");
        // เปลี่ยนเส้นทางไปยังหน้าแดชบอร์ด
      }
    } catch (error) {
      // กรณีเกิดข้อผิดพลาด เช่น username/password ผิด
      toast.error(error.response?.data ?? "เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
      // แสดงข้อความแจ้งเตือน error ที่ได้จาก API หรือข้อความทั่วไป
    } finally {
      setLoading(false);
      // ปิดสถานะ loading ไม่ว่าจะสำเร็จหรือผิดพลาด
    }
  };

  return (
    <div className="h-screen flex flex-col md:flex-row bg-blue-50">
      {/* container หลัก แสดงเต็มหน้าจอ ใช้ flex column บนมือถือ และ flex row บน desktop */}
      
      {/* ฝั่งซ้าย: แสดงรูปทรงเวกเตอร์ตกแต่ง (ซ่อนบนมือถือ) */}
      <div className="hidden md:flex w-1/2 items-center justify-center relative overflow-hidden">
        {/* สร้าง shape 3 ชั้นด้วย div และสีต่างๆ พร้อมตำแหน่งซ้อนกัน */}
        <div className="absolute w-[350px] h-[350px] bg-[#d7ecec] rounded-[60%] top-24 left-20 z-10" />
        <div className="absolute w-[380px] h-[380px] bg-[#78c5d6] rounded-[60%] top-36 left-36 z-20" />
        <div className="absolute w-[340px] h-[340px] bg-[#4ba084] rounded-[60%] top-64 left-10 z-30" />
      </div>

      {/* ฝั่งขวา: ฟอร์มล็อกอิน */}
      <div className="flex-1 min-h-screen flex items-center justify-center px-6 py-10 bg-white">
        {/* ฟอร์มมีความกว้างเต็มฝั่ง ขนาดสูงอย่างน้อยเท่าหน้าจอ และจัดกึ่งกลาง */}
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
          {/* ชื่อเว็บและคำอธิบาย */}
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900">
              iCare<span className="text-black font-extrabold">@KMUTNB</span>
            </h1>
            <p className="text-lg text-black mt-1 font-semibold">เข้าสู่ระบบหลังบ้าน</p>
          </div>

          {/* ช่องกรอกชื่อผู้ใช้งาน */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อผู้ใช้งาน</label>
            <input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* ช่องกรอกรหัสผ่าน */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่าน</label>
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* ปุ่ม submit */}
          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded-md transition-all duration-200 shadow"
            disabled={loading}
          >
            {/* แสดงข้อความเปลี่ยนตามสถานะ loading */}
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>
      </div>
    </div>
  );
}
