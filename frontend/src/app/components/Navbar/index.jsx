"use client";
// บอก Next.js ว่าโค้ดนี้เป็น client component รันบนฝั่ง client

import { useState, useEffect } from "react";
// นำเข้า React hooks สำหรับจัดการ state และ lifecycle

import Link from "next/link";
// นำเข้า component สำหรับลิงก์ไปหน้าอื่นใน Next.js

import { toast } from "react-toastify";
// นำเข้าไลบรารีสำหรับแสดง notification แบบ toast

import Cookies from 'js-cookie';
// นำเข้าไลบรารีจัดการ cookie บน browser

import { useRouter } from "next/navigation";
// นำเข้า hook สำหรับเปลี่ยนเส้นทาง (redirect) ใน Next.js

const Navbar = () => {
    // คอมโพเนนต์ Navbar แสดงแถบเมนูด้านบน

    const [menuOpen, setMenuOpen] = useState(false);
    // state เก็บสถานะเปิด/ปิดเมนูสำหรับมือถือ

    const [isLogin, setIsLogin] = useState(false);
    // state เก็บสถานะว่าผู้ใช้ล็อกอินอยู่หรือไม่

    const [user, setUser] = useState();
    // state เก็บข้อมูลผู้ใช้ (เช่น username)

    const router = useRouter();
    // ตัวช่วยเปลี่ยนหน้า (redirect)

    useEffect(() => {
        // ตรวจสอบสถานะการล็อกอินตอนโหลด component ครั้งแรก
        const checkLogin = () => {
            const token = Cookies.get('token');
            const userData = Cookies.get('user');

            if (token && userData) {
                setIsLogin(true);
                setUser(JSON.parse(userData));  // แปลง JSON string เป็น object
            } else {
                setIsLogin(false);
                setUser(null);
            }
        };

        checkLogin();

        // ฟัง event ชื่อ 'loginStatusChanged' เพื่ออัปเดตสถานะล็อกอินเมื่อมีการเปลี่ยนแปลง
        window.addEventListener('loginStatusChanged', checkLogin);

        return () => {
            // ลบ event listener เมื่อ component ถูกถอดออกจาก DOM
            window.removeEventListener('loginStatusChanged', checkLogin);
        };
    }, []);

    const logout = () => {
        // ฟังก์ชันสำหรับออกจากระบบ
        Cookies.remove('token');  // ลบ token cookie
        Cookies.remove('user');   // ลบ user cookie
        router.push('/');         // เปลี่ยนหน้าไปหน้าแรก
        toast.success('ออกจากระบบสำเร็จ!');  // แสดงข้อความแจ้งเตือน
        window.dispatchEvent(new Event('loginStatusChanged'));
        // แจ้ง event ให้ component อื่นๆ รู้ว่าสถานะล็อกอินเปลี่ยนไปแล้ว
    };

    const toggleMenu = () => {
        // สลับสถานะเมนูเปิด/ปิด (สำหรับมือถือ)
        setMenuOpen(!menuOpen);
    };

    return (
        <header className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white py-4 px-12 shadow-md relative z-50">
            {/* แถบเมนูหลัก ด้านบนหน้าจอ */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
                {/* โลโก้เว็บไซต์ */}
                <Link href="/" className="text-2xl font-bold">iCare@KMUTNB</Link>

                {/* ปุ่มเมนูแบบ hamburger สำหรับหน้าจอเล็ก */}
                <button className="block lg:hidden text-2xl" onClick={toggleMenu}>
                    ☰
                </button>

                {/* เมนูลิงก์หลัก */}
                <nav
                    className={`flex items-center gap-4 ${
                        menuOpen
                            ? "absolute right-0 top-16 bg-blue-600 flex-col items-end w-full p-4 z-50"
                            : "hidden"
                    } lg:flex lg:justify-end lg:w-auto lg:static`}
                >
                    {/* ลิงก์หน้าแรก */}
                    <Link href="/" className="text-white hover:text-yellow-400 transition-colors py-2 px-4">
                        หน้าแรก
                    </Link>

                    {/* ลิงก์เกี่ยวกับเรา */}
                    <Link href="/about" className="text-white hover:text-yellow-400 transition-colors py-2 px-4">
                        เกี่ยวกับเรา
                    </Link>

                    {/* แสดงลิงก์แดชบอร์ด และปุ่มออกจากระบบถ้าล็อกอินแล้ว */}
                    {isLogin ? (
                        <div className="flex items-center gap-4">
                            <Link href="/admin/dashboard" className="text-white hover:text-yellow-400 transition-colors py-2 px-4">
                                แดชบอร์ด
                            </Link>
                            <span className="text-white">{user.username}</span>
                            <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded">
                                ออกจากระบบ
                            </button>
                        </div>
                    ) : (
                        <div></div> // ถ้ายังไม่ล็อกอิน ไม่แสดงอะไรตรงนี้
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
// ส่งออกคอมโพเนนต์ Navbar เพื่อใช้งานในไฟล์อื่น
