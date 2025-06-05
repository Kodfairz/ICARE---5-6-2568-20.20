"use client";
// บอก Next.js ว่าไฟล์นี้เป็น client component รันบนฝั่ง client

import React from "react";
// นำเข้า React (ที่จริง Next.js ใหม่นำเข้าให้เองก็ได้)

export default function ModalConfirm({
  isOpen,
  title = "ยืนยัน",
  message,
  onConfirm,
  onCancel,
  confirmText = "ตกลง",
  cancelText = "ยกเลิก",
}) {
  // คอมโพเนนต์ ModalConfirm ใช้แสดงกล่องยืนยัน (confirm dialog)
  // รับ props หลักๆ เช่น
  // - isOpen: ควบคุมให้ modal แสดงหรือไม่
  // - title: หัวข้อ modal (default: "ยืนยัน")
  // - message: ข้อความภายใน modal
  // - onConfirm: ฟังก์ชันเมื่อกดปุ่มยืนยัน
  // - onCancel: ฟังก์ชันเมื่อกดยกเลิก หรือปิด modal
  // - confirmText: ข้อความปุ่มยืนยัน (default: "ตกลง")
  // - cancelText: ข้อความปุ่มยกเลิก (default: "ยกเลิก")

  if (!isOpen) return null;
  // ถ้า isOpen เป็น false ให้ return null ไม่แสดงอะไรเลย

  return (
    // แสดง overlay ทึบพร้อมเบลอเล็กน้อย ครอบคลุมทั้งหน้าจอ
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm"
      onClick={onCancel} // ถ้ากดที่พื้นหลัง (overlay) จะเรียก onCancel เพื่อปิด modal
    >
      <div
        className="bg-white rounded-xl p-6 w-96 max-w-full shadow-xl
                   transform transition-transform duration-300
                   hover:scale-[1.02]"
        onClick={(e) => e.stopPropagation()} 
        // หยุดการส่ง event คลิกออกไปยัง overlay 
        // เพื่อไม่ให้กดภายใน modal แล้วปิด modal ด้วย
      >
        {/* หัวข้อ modal */}
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">{title}</h2>
        {/* ข้อความเนื้อหา */}
        <p className="mb-6 text-gray-600">{message}</p>
        {/* ปุ่มคำสั่ง */}
        <div className="flex justify-end gap-4">
          {/* ปุ่มยกเลิก */}
          <button
            onClick={onCancel}
            className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
          >
            {cancelText}
          </button>
          {/* ปุ่มยืนยัน */}
          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 shadow-md transition"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
