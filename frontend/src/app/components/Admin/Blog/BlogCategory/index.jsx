"use client";
// ประกาศเป็น Client Component ของ Next.js

import { useState, useMemo, useEffect } from "react";
// นำเข้า hooks ที่จำเป็น: useState, useMemo, useEffect

import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    flexRender,
} from "@tanstack/react-table";
// นำเข้า API ของ React Table สำหรับสร้างตารางแบบยืดหยุ่น

import axios from "axios";
// สำหรับเรียก API

import { API } from "../../../../service/api";
// URL พื้นฐานของ API

import AddBlogCategory from "./AddBlogCategory";
// คอมโพเนนต์ฟอร์มเพิ่มประเภทข้อมูล

import { toast } from "react-toastify";
// แจ้งเตือนสถานะต่าง ๆ

import EditBlogCategory from "./EditBlogCategory";
// คอมโพเนนต์ฟอร์มแก้ไขประเภทข้อมูล

import ModalConfirm from "../../../ModalConfirm";
// คอมโพเนนต์โมดาลยืนยันการลบ

export default function CategoryBlog() {
  // State จัดการเปิดปิด modal ต่าง ๆ
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal confirm ลบ
  const [data, setData] = useState([]); // ข้อมูลประเภทข้อมูลจาก API
  const [isModalOpenAdd, setIsModalOpenAdd] = useState(false); // Modal เพิ่มข้อมูล
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false); // Modal แก้ไขข้อมูล
  const [Id, setId] = useState(""); // เก็บ id ของประเภทข้อมูลที่จะถูกแก้ไข
  const [idDelete, setIdDelete] = useState(0); // เก็บ id ของประเภทข้อมูลที่จะถูกลบ

  // ฟังก์ชันดึงข้อมูลประเภทข้อมูลจาก API
  const getCategory = async () => {
    try {
      const response = await axios.get(`${API}/category/`);
      setData(response.data.resultData); // เก็บข้อมูลที่ได้ไว้ใน state data
    } catch (error) {
      console.log(error);
    }
  };

  // ฟังก์ชันเพิ่มประเภทข้อมูลใหม่ โดยรับ input จากฟอร์ม
  const addCategory = async (input) => {
    try {
      const response = await axios.post(`${API}/category/`, {
        name: input.name,
      });
      toast.success(response.data.message); // แจ้งเตือนสำเร็จ
      getCategory(); // ดึงข้อมูลใหม่เพื่ออัปเดตตาราง
      setIsModalOpenAdd(false); // ปิด modal เพิ่มข้อมูล
    } catch (error) {
      console.log(error);
      toast.error(error.response?.message || "ไม่สามารถเพิ่มประเภทข้อมูล"); // แจ้งเตือนผิดพลาด
    }
  };

  // ฟังก์ชันแก้ไขประเภทข้อมูลที่มี id เท่ากับ Id ใน state
  const editCategory = async (input) => {
    try {
      const response = await axios.put(`${API}/category/${Id}`, {
        name: input.name,
      });
      toast.success(response.data.message); // แจ้งเตือนสำเร็จ
      setIsModalOpenEdit(false); // ปิด modal แก้ไข
      getCategory(); // ดึงข้อมูลใหม่อัปเดตตาราง
    } catch (error) {
      console.log(error);
      toast.error(error.response?.message || "ไม่สามารถแก้ไขประเภทข้อมูล"); // แจ้งเตือนผิดพลาด
    }
  };

  // ฟังก์ชันลบประเภทข้อมูลที่ id เท่ากับ idDelete
  const deleteCategory = async () => {
    try {
      const response = await axios.delete(`${API}/category/${idDelete}`);
      toast.success(response.data.message); // แจ้งเตือนสำเร็จ
      getCategory(); // ดึงข้อมูลใหม่อัปเดตตาราง
      setIsModalOpen(false); // ปิด modal confirm ลบ
    } catch (error) {
      console.log(error);
      toast.error(error.response?.message || "ไม่สามารถลบประเภทข้อมูล"); // แจ้งเตือนผิดพลาด
    }
  };

  // useEffect เรียก getCategory ครั้งแรกตอนโหลดคอมโพเนนต์
  useEffect(() => {
    getCategory();
  }, []);

  // กำหนดคอลัมน์สำหรับตาราง โดยใช้ useMemo เพื่อไม่ให้คอลัมน์สร้างซ้ำทุกเรนเดอร์
  const columns = useMemo(
    () => [
      { header: "ไอดี", accessorKey: "id" }, // คอลัมน์ id
      { header: "ชื่อ", accessorKey: "name" }, // คอลัมน์ชื่อประเภท
      {
        header: "เครื่องมือ",
        id: "actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            {/* ปุ่มแก้ไข เปิด modal แก้ไข และตั้งค่า id ที่จะแก้ไข */}
            <button
              onClick={() => {
                setIsModalOpenEdit(true);
                setId(row.original.id);
              }}
              className="px-3 py-1 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all duration-200 transform hover:scale-105"
            >
              แก้ไข
            </button>
            {/* ปุ่มลบ เปิด modal confirm ลบ และตั้งค่า id ที่จะลบ */}
            <button
              onClick={() => {
                setIdDelete(row.original.id);
                setIsModalOpen(true);
              }}
              className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 transform hover:scale-105"
            >
              ลบ
            </button>
          </div>
        ),
      },
    ],
    []
  );

  // สร้างตารางด้วย React Table
  const table = useReactTable({
    data: data, // ข้อมูลในตาราง
    columns, // คอลัมน์ของตาราง
    getCoreRowModel: getCoreRowModel(), // วิธีการจัดการ row พื้นฐาน
    getPaginationRowModel: getPaginationRowModel(), // เปิดใช้งานการแบ่งหน้า
    initialState: { pagination: { pageSize: 10 } }, // ตั้งค่าเริ่มต้นแสดง 10 แถวต่อหน้า
  });

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">จัดการประเภทข้อมูล</h2>

      {/* ปุ่มเพิ่มประเภทข้อมูล เปิด modal เพิ่มข้อมูล */}
      <button
        onClick={() => {
          setIsModalOpenAdd(true);
        }}
        className="p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105"
      >
        เพิ่มประเภทข้อมูล
      </button>

      {/* แสดง modal เพิ่มข้อมูลเมื่อ isModalOpenAdd เป็น true */}
      {isModalOpenAdd && (
        <AddBlogCategory onClose={() => setIsModalOpenAdd(false)} onSubmit={addCategory} />
      )}

      {/* แสดง modal แก้ไขข้อมูลเมื่อ isModalOpenEdit เป็น true */}
      {isModalOpenEdit && (
        <EditBlogCategory onClose={() => setIsModalOpenEdit(false)} onSubmit={editCategory} id={Id} />
      )}

      {/* ตารางแสดงข้อมูลประเภท */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 mt-6 shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-600 text-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="p-4 text-left font-semibold text-sm uppercase tracking-wider"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-indigo-50 transition-all duration-200">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-4 text-gray-700">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ปุ่มควบคุมการเปลี่ยนหน้า */}
      <div className="mt-6 flex flex-wrap gap-4 justify-between items-center">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition-all duration-200 transform hover:scale-105"
        >
          Previous
        </button>

        <span className="text-gray-600">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>

        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition-all duration-200 transform hover:scale-105"
        >
          Next
        </button>
      </div>

      {/* แสดง modal ยืนยันลบเมื่อ isModalOpen เป็น true */}
      {isModalOpen && (
        <ModalConfirm
          isOpen={isModalOpen}
          title="ยืนยันการลบประเภทข้อมูล"
          message="คุณแน่ใจหรือไม่ว่าต้องการลบประเภทข้อมูลนี้? การลบไม่สามารถย้อนกลับได้"
          onConfirm={deleteCategory}
          onCancel={() => setIsModalOpen(false)}
          confirmText="ลบ"
          cancelText="ยกเลิก"
        />
      )}
    </div>
  );
}
