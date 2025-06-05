"use client"; // ประกาศให้ Next.js รู้ว่านี่คือ client component

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // ใช้สำหรับการนำทางหน้า
import { useEditor, EditorContent } from "@tiptap/react"; // Tiptap editor
import StarterKit from "@tiptap/starter-kit"; // extension พื้นฐานของ Tiptap
import Image from "@tiptap/extension-image"; // extension สำหรับใส่รูปภาพใน editor
import axios from "axios"; // สำหรับเรียก API
import { toast } from "react-toastify"; // แสดงข้อความแจ้งเตือน
import { API } from "../../../../service/api"; // base API url
import Switch from "react-switch"; // คอมโพเนนต์สวิตช์เปิด-ปิด
import dynamic from "next/dynamic"; // สำหรับ dynamic import
import { useDropzone } from "react-dropzone"; // hook สำหรับ drag & drop ไฟล์
import Cookies from "js-cookie"; // จัดการ cookie


export default function AddVideoPage() {
  // state เก็บค่าต่างๆ ในฟอร์ม
  const [title, setTitle] = useState(""); // หัวข้อวิดีโอ
  const [coverImage, setCoverImage] = useState(null); // URL รูปหน้าปก
  const [videoLink, setVideoLink] = useState(""); // URL วิดีโอ (Youtube)
  const [isLoading, setIsLoading] = useState(false); // สถานะโหลดระหว่างบันทึก
  const [publishStatus, setPublishStatus] = useState(true); // สถานะเผยแพร่ (true = เผยแพร่)
  const [content, setContent] = useState(""); // รายละเอียดวิดีโอ
  const router = useRouter(); // สำหรับนำทางหน้า

  // กำหนด editor ของ Tiptap
  const editor = useEditor({
    extensions: [
      StarterKit, // ชุด extension พื้นฐาน
      Image.configure({ inline: true }), // รองรับการแทรกรูปแบบ inline
    ],
    content: "", // เนื้อหาเริ่มต้นว่าง
  });

  // ฟังก์ชันอัปโหลดรูปภาพไปยัง Cloudinary
  const handleImageUpload = async (file) => {
    if (!file) {
      toast.error("กรุณาเลือกไฟล์รูปภาพ!"); // แจ้งเตือนถ้าไม่เลือกไฟล์
      return null;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("รองรับเฉพาะไฟล์รูปภาพ!"); // แจ้งเตือนถ้าไม่ใช่รูปภาพ
      return null;
    }

    // สร้าง FormData สำหรับอัปโหลด
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", `jyvur9yd`); // Preset ของ Cloudinary
    formData.append("folder", "icare"); // โฟลเดอร์ใน Cloudinary

    try {
      // เรียก API อัปโหลดไฟล์ไปยัง Cloudinary
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dcq3ijz0g/image/upload`,
        formData
      );

      return response.data.url; // คืน URL ของรูปที่อัปโหลดสำเร็จ
    } catch (error) {
      console.error("Error uploading image:", error.response?.data || error.message);
      toast.error("อัปโหลดรูปภาพไม่สำเร็จ"); // แจ้งเตือนเมื่ออัปโหลดล้มเหลว
      return null;
    }
  };

  // ฟังก์ชันเปิดหน้าต่างเลือกไฟล์ภาพและเพิ่มรูปใน editor
  const addImage = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*"); // รับเฉพาะไฟล์ภาพ
    input.click(); // เปิด dialog เลือกไฟล์

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      const imageUrl = await handleImageUpload(file); // อัปโหลดภาพ
      if (imageUrl && editor) {
        editor.chain().focus().setImage({ src: imageUrl }).run(); // แทรกรูปใน editor
      }
    };
  };

  // ฟังก์ชันอัปโหลดหน้าปกและเก็บ URL
  const handleCoverImageUpload = async (file) => {
    const imageUrl = await handleImageUpload(file);
    if (imageUrl) {
      setCoverImage(imageUrl); // บันทึก URL ของหน้าปก
    }
  };

  // ฟังก์ชันรับไฟล์ที่ลากมาวางผ่าน react-dropzone
  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      handleCoverImageUpload(acceptedFiles[0]); // อัปโหลดไฟล์แรกที่ลากมา
    }
  };

  // ฟังก์ชันส่งข้อมูลวิดีโอไปยัง backend
  const handleSubmit = async (e) => {
    e.preventDefault(); // ป้องกัน reload หน้า
    setIsLoading(true); // ตั้งสถานะโหลด

    try {
      // เรียก API สร้างวิดีโอใหม่
      const response = await axios.post(`${API}/video`, {
        title,
        thumbnail_url: coverImage, // ส่ง URL รูปหน้าปก
        url: videoLink, // ส่ง URL วิดีโอ
        description: content, // ส่งรายละเอียด
        isActive: publishStatus, // ส่งสถานะเผยแพร่
        user_id: `${JSON.parse(Cookies.get("user")).id}`, // user id จาก cookie
        update_id: `${JSON.parse(Cookies.get("user")).id}`, // update id จาก cookie
      });
      if (response.status === 200) {
        toast.success(response.data.message || "เพิ่มวิดีโอสำเร็จ!"); // แจ้งสำเร็จ
        router.push("/admin/dashboard"); // ไปหน้าหลัก dashboard
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "เพิ่มวิดีโอไม่สำเร็จ"); // แจ้ง error
    } finally {
      setIsLoading(false); // ปิดสถานะโหลด
    }
  };

  // ฟังก์ชันแปลงลิงก์ YouTube เป็น iframe สำหรับแสดง preview
  const renderVideoPreview = (link) => {
    const youtubePattern =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = link.match(youtubePattern);
    if (match) {
      const videoId = match[1]; // ดึง video id จาก URL
      return (
        <div className="mt-4">
          <iframe
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      );
    }
    return null; // ถ้าไม่ใช่ลิงก์ YouTube ไม่แสดง preview
  };

  // ตั้งค่า react-dropzone สำหรับการลากและวางไฟล์รูปภาพ
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*", // รับเฉพาะไฟล์รูปภาพ
  });

  return (
    <div className="container mx-auto p-6 min-h-screen">
      {/* หัวข้อหน้า */}
      <h1 className="text-4xl font-bold text-gray-800 mb-8 animate-fade-in-down">เพิ่มวิดีโอ</h1>

      {/* ฟอร์มเพิ่มวิดีโอ */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        {/* Input หัวข้อ */}
        <div>
          <label htmlFor="title" className="block text-lg font-medium text-gray-700 mb-2">
            หัวข้อ
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            placeholder="ป้อนหัวข้อ"
          />
        </div>

        {/* Input รูปหน้าปก (drag & drop) */}
        <div>
          <label htmlFor="coverImage" className="block text-lg font-medium text-gray-700 mb-2">
            หน้าปกข้อมูล
          </label>
          <div
            {...getRootProps()}
            className="border-dashed border-2 border-gray-300 p-6 text-center cursor-pointer"
          >
            <div>
              <span className="text-gray-500">ลากและวางหรือลือกไฟล์</span>
            </div>
            <input {...getInputProps()} />
            {/* แสดงรูปหน้าปกถ้ามี */}
            {coverImage && <img src={coverImage} alt="Cover" className="w-1/3 rounded-lg mt-4" />}
          </div>
        </div>

        {/* Input ลิงก์วิดีโอ */}
        <div>
          <label htmlFor="videoLink" className="block text-lg font-medium text-gray-700 mb-2">
            ลิงก์วิดีโอ
          </label>
          <input
            type="url"
            id="videoLink"
            value={videoLink}
            onChange={(e) => setVideoLink(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            placeholder="กรอกลิงก์วิดีโอแนะนำ"
          />
          {/* แสดง preview วิดีโอถ้ามีลิงก์ */}
          {videoLink && renderVideoPreview(videoLink)}
        </div>

        {/* สถานะการเผยแพร่ */}
        <div>
          <label htmlFor="publishStatus" className="block text-lg font-medium text-gray-700 mb-2">
            สถานะการเผยแพร่
          </label>
          <div className="flex items-center gap-4">
            <span>ไม่เผยแพร่</span>
            <Switch
              checked={publishStatus}
              onChange={() => setPublishStatus(!publishStatus)} // สลับสถานะ
              offColor="#888"
              onColor="#4CAF50"
              offHandleColor="#FFF"
              onHandleColor="#FFF"
              height={30}
              width={60}
            />
            <span>เผยแพร่</span>
          </div>
        </div>

        {/* รายละเอียดวิดีโอ */}
        <div>
          <label htmlFor="publishStatus" className="block text-lg font-medium text-gray-700 mb-2">
            รายละเอียด
          </label>
          <textarea
            required
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
          ></textarea>
        </div>

        {/* ปุ่มเพิ่มวิดีโอและยกเลิก */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300 disabled:opacity-50"
          >
            {isLoading ? "กำลังเพิ่ม..." : "เพิ่มวิดีโอ"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/dashboard")}
            className="flex-1 p-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200"
          >
            ยกเลิก
          </button>
        </div>
      </form>
    </div>
  );
}
