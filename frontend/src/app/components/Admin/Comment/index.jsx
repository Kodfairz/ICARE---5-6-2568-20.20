"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { API } from "../../../service/api"
import { toast } from "react-toastify";
import axios from "axios";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    flexRender,
} from "@tanstack/react-table";
import * as dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/th"; // import locale ภาษาไทยสำหรับ dayjs

const Comment = () => {
    dayjs.locale("th"); // ตั้งค่า locale เป็นภาษาไทย
    dayjs.extend(relativeTime); // เพิ่ม plugin สำหรับแสดงเวลาสัมพันธ์เช่น "2 ชั่วโมงที่แล้ว"

    // state เก็บข้อมูล comment ที่ดึงมาจาก API
    const [comments, setComments] = useState([])

    // ฟังก์ชันดึงข้อมูล comment จาก API
    const getComments = async () => {
        try {
            const response = await axios.get(`${API}/comments`) // เรียก API
            setComments(response.data.resultData) // เซ็ตข้อมูล comment ที่ได้ลง state
        } catch (error) {
            console.log(error)
            toast.error(error.response.message || "ไม่สามารถเรียกข้อความได้") // แจ้งเตือนเมื่อเกิด error
        }
    }

    // ใช้ useEffect เรียก getComments ครั้งแรกตอน component โหลดเสร็จ
    useEffect(() => {
        getComments()
    },[])

    // กำหนดคอลัมน์ของตาราง โดยใช้ useMemo เพื่อเพิ่มประสิทธิภาพ
    const columns = useMemo(() => [
        {
          header: "ID", // ชื่อหัวตาราง
          accessorKey: "id", // key ที่จะใช้ดึงข้อมูลจากแต่ละแถว
        },
        {
          header: "ข้อความ",
          accessorKey: "value",
          // แสดงข้อความโดยมีการจัดรูปแบบให้อักษรสามารถขึ้นบรรทัดใหม่ได้
          cell: ({ getValue }) => (
            <div className="w-64 whitespace-normal break-words">
              {getValue()}
            </div>
          ),
        },
        {
            header: "วันที่สร้าง",
            // แสดงวันที่สร้าง โดยใช้ dayjs ฟอร์แมตให้อ่านง่ายในรูปแบบวันที่เต็ม
            cell: ({ row }) => (
                <>
                    <p>{dayjs(row.original.created_at).format("DD MMMM YYYY")}</p>
                </>
            ),
          },
      ], []);

    // สร้างตารางโดยใช้ TanStack Table (React Table)
    const table = useReactTable({
        data: comments, // ข้อมูลที่จะแสดง
        columns, // คอลัมน์ที่กำหนดไว้
        getCoreRowModel: getCoreRowModel(), // ฟังก์ชันจัดการแถวหลัก
        getPaginationRowModel: getPaginationRowModel(), // ฟังก์ชันจัดการแถวสำหรับ pagination
        initialState: { pagination: { pageSize: 5 } }, // ตั้งค่าจำนวนแถวต่อหน้าเริ่มต้นเป็น 5
    });

   return (
         <div>

             {/* ตารางข้อมูล comment */}
             <div className="overflow-x-auto rounded-lg border border-gray-200">
                 <table className="min-w-full divide-y divide-gray-200">
                     <thead className="bg-indigo-600 text-white">
                         {table.getHeaderGroups().map((headerGroup) => (
                             <tr key={headerGroup.id}>
                                 {headerGroup.headers.map((header) => (
                                     <th
                                         key={header.id}
                                         className="p-4 text-left font-semibold text-sm uppercase tracking-wider"
                                     >
                                         {/* แสดงหัวตาราง */}
                                         {flexRender(header.column.columnDef.header, header.getContext())}
                                     </th>
                                 ))}
                             </tr>
                         ))}
                     </thead>
                     <tbody className="divide-y divide-gray-200">
                         {table.getRowModel().rows.map((row) => (
                             <tr
                                 key={row.id}
                                 className="hover:bg-indigo-50 transition-all duration-200"
                             >
                                 {row.getVisibleCells().map((cell) => (
                                     <td key={cell.id} className="p-4 text-gray-700">
                                         {/* แสดงข้อมูลในแต่ละเซลล์ */}
                                         {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                     </td>
                                 ))}
                             </tr>
                         ))}
                     </tbody>
                 </table>
             </div>

             {/* ส่วนควบคุม Pagination */}
             <div className="mt-6 flex flex-wrap gap-4 justify-between items-center">
                 {/* ปุ่มย้อนกลับหน้า */}
                 <button
                     onClick={() => table.previousPage()}
                     disabled={!table.getCanPreviousPage()}
                     className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition-all duration-200"
                 >
                     Previous
                 </button>

                 {/* แสดงหน้าปัจจุบันและจำนวนหน้าทั้งหมด */}
                 <span className="text-gray-600">
                     Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                 </span>

                 {/* ปุ่มไปหน้าถัดไป */}
                 <button
                     onClick={() => table.nextPage()}
                     disabled={!table.getCanNextPage()}
                     className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition-all duration-200"
                 >
                     Next
                 </button>
             </div>
         </div>
     );
}

export default Comment
