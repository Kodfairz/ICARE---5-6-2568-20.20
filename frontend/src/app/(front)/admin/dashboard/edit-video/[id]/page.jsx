"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import axios from "axios";
import { toast } from "react-toastify";
import { API } from "../../../../../service/api";
import Switch from "react-switch"; // คอมโพเนนต์สวิตช์เปิด/ปิด
import dynamic from "next/dynamic"; // สำหรับโหลด react-select แบบ dynamic (ไม่ได้ใช้ในโค้ดนี้)
import { useDropzone } from "react-dropzone"; // สำหรับลากและวางไฟล์
import Cookies from "js-cookie";

export default function EditVideoPage() {
  // สถานะของฟอร์ม
  const [title, setTitle] = useState("");            // ชื่อหัวข้อวิดีโอ
  const [coverImage, setCoverImage] = useState(null); // URL รูปหน้าปก
  const [videoLink, setVideoLink] = useState("");     // ลิงก์วิดีโอ (เช่น Youtube)
  const [isLoading, setIsLoading] = useState(false);  // สถานะกำลังโหลด/ส่งข้อมูล
  const [publishStatus, setPublishStatus] = useState(true); // สถานะเผยแพร่ (true=เผยแพร่)
  const [content, setContent] = useState("")           // เนื้อหารายละเอียดวิดีโอ

  const router = useRouter(); // ตัวช่วยนำทางของ Next.js
  const { id } = useParams()  // ดึงพารามิเตอร์ id จาก URL

  // ฟังก์ชันดึงข้อมูลวิดีโอตาม id
  const getVideoById = async () => {
    try {
      const response = await axios.get(`${API}/video/${id}`); // เรียก API
      console.log(response);
      // ตั้งค่าข้อมูลที่ได้มาในสถานะต่างๆ
      setTitle(response.data.resultData.title);
      setVideoLink(response.data.resultData.url);
      setContent(response.data.resultData.description);
      setPublishStatus(response.data.resultData.isActive);
      setCoverImage(response.data.resultData.thumbnail_url);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.message || "ไม่สามารถเรียกวิดีโอได้"); // แจ้งเตือนเมื่อเกิดข้อผิดพลาด
    }
  };

  // เรียกดึงข้อมูลเมื่อ component โหลดครั้งแรก
  useEffect(() => {
    getVideoById();
  }, []);

  // ตั้งค่า editor ของ Tiptap (ยังไม่ได้ใช้ใน UI)
  const editor = useEditor({
    extensions: [
      StarterKit,  // ฟีเจอร์พื้นฐาน เช่น bold, italic, lists
      Image.configure({ // ตั้งค่า image extension ให้แสดงแบบ inline
        inline: true,
      }),
    ],
    content: "",
  });

  // ฟังก์ชันอัปโหลดรูปภาพขึ้น Cloudinary
  const handleImageUpload = async (file) => {
    if (!file) {
      toast.error("กรุณาเลือกไฟล์รูปภาพ!");
      return null;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("รองรับเฉพาะไฟล์รูปภาพ!");
      return null;
    }

    // สร้าง FormData สำหรับอัปโหลด
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", `jyvur9yd`);  // preset ของ Cloudinary
    formData.append("folder", "icare");             // โฟลเดอร์บน Cloudinary

    try {
      // ส่งไฟล์ไปยัง Cloudinary
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dcq3ijz0g/image/upload`,
        formData
      );
      return response.data.url; // คืน URL ของรูปที่อัปโหลด
    } catch (error) {
      console.error("Error uploading image:", error.response?.data || error.message);
      toast.error("อัปโหลดรูปภาพไม่สำเร็จ");
      return null;
    }
  };

  // ฟังก์ชันเพิ่มรูปภาพเข้า editor (ยังไม่แสดง editor ใน UI)
  const addImage = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      const imageUrl = await handleImageUpload(file);
      if (imageUrl && editor) {
        // แทรกรูปภาพลงใน editor
        editor.chain().focus().setImage({ src: imageUrl }).run();
      }
    };
  };

  // อัปโหลดรูปหน้าปก และเซ็ต URL
  const handleCoverImageUpload = async (file) => {
    const imageUrl = await handleImageUpload(file);
    if (imageUrl) {
      setCoverImage(imageUrl); // เก็บ URL รูปหน้าปก
    }
  };

  // ฟังก์ชันรับไฟล์จากการลากและวาง
  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      handleCoverImageUpload(acceptedFiles[0]);
    }
  };

  // ฟังก์ชันส่งข้อมูลแก้ไขวิดีโอ
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // กำลังส่งข้อมูล

    try {
      // เรียก API PUT เพื่อแก้ไขข้อมูลวิดีโอ
      const response = await axios.put(`${API}/video/${id}`, {
        title,
        thumbnail_url: coverImage,
        url: videoLink,
        description: content,
        isActive: publishStatus,
        update_id: `${JSON.parse(Cookies.get("user")).id}`, // ดึง id ผู้แก้ไขจาก cookie
      });
      if (response.status === 200) {
        toast.success(response.data.message || "เเก้ไขวิดีโอสำเร็จ!");
        router.push("/admin/dashboard"); // กลับหน้าแดชบอร์ดหลังแก้ไขสำเร็จ
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "เเก้ไขวิดีโอไม่สำเร็จ");
    } finally {
      setIsLoading(false); // ปิดสถานะกำลังส่งข้อมูล
    }
  };

  // ฟังก์ชันแปลงลิงก์ YouTube เป็น iframe สำหรับแสดงวิดีโอ preview
  const renderVideoPreview = (link) => {
    // pattern ตรวจจับ videoId ของ YouTube
    const youtubePattern =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = link.match(youtubePattern);
    if (match) {
      const videoId = match[1];
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
    return null; // ถ้าไม่ใช่ลิงก์ YouTube คืนค่า null
  };

  // ตั้งค่า react-dropzone สำหรับอัปโหลดภาพหน้าปก
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*", // กำหนดให้รับเฉพาะไฟล์รูปภาพ
  });

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 animate-fade-in-down">แก้ไขวิดีโอ</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        {/* Input หัวข้อวิดีโอ */}
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

        {/* Input รูปหน้าปก (ลากและวางหรือคลิกเลือกไฟล์) */}
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

        {/* สถานะการเผยแพร่ (สวิตช์เปิด/ปิด) */}
        <div>
          <label htmlFor="publishStatus" className="block text-lg font-medium text-gray-700 mb-2">
            สถานะการเผยแพร่
          </label>
          <div className="flex items-center gap-4">
            <span>ไม่เผยแพร่</span>
            <Switch
              checked={publishStatus}
              onChange={() => setPublishStatus(!publishStatus)} // toggle สถานะ
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

        {/* ช่องกรอกรายละเอียด */}
        <div>
          <label htmlFor="publishStatus" className="block text-lg font-medium text-gray-700 mb-2">
            รายละเอียด
          </label>
          <textarea
            value={content}
            required
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
          ></textarea>
        </div>

        {/* ปุ่มบันทึกและยกเลิก */}
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
