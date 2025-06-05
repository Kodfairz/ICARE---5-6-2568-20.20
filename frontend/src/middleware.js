import { NextResponse } from 'next/server';

export function middleware(request) {
    // ตรวจสอบว่า request มาจากหน้าไหน
    const url = request.url;

    // ดึงค่า token จากคุกกี้
    const token = request.cookies.get('token'); // หรือ 'token' คือชื่อคุกกี้ที่คุณใช้

    // ถ้าไม่มี token และกำลังพยายามเข้าหน้า /admin/login ก็ให้ปล่อยให้หน้าถูกแสดง
    if (!token && url.includes('/admin/login')) {
        return NextResponse.next(); // ถ้าไม่มี token และเข้าหน้า login ก็ให้หน้า login แสดงขึ้น
    }

    // ถ้าไม่มี token และกำลังพยายามเข้าหน้า admin ให้รีไดเรกต์ไปที่หน้า login
    if (!token && url.includes('/admin')) {
        return NextResponse.redirect(new URL('/admin/login', request.url)); // เปลี่ยนเป็น URL หน้า login ที่คุณต้องการ
    }

    // ถ้ามี token และกำลังพยายามเข้าหน้า /admin/login ก็จะรีไดเรกต์ไปที่หน้า dashboard
    if (token && url.includes('/admin/login')) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url)); 
    }

    // ถ้าทุกอย่างโอเค ก็ปล่อยให้ request นี้ไปต่อ
    return NextResponse.next();
}

// กำหนดว่า Middleware นี้จะทำงานที่ URL path ไหน
export const config = {
    matcher: ['/admin/:path*'], // ใช้ matcher แบบที่รองรับได้ใน Next.js
};
