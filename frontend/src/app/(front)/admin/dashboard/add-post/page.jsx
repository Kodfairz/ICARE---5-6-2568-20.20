"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";

import axios from "axios";
import { toast } from "react-toastify";
import { API } from "../../../../service/api";
import Switch from "react-switch";
import dynamic from "next/dynamic";
import { useDropzone } from "react-dropzone";
import Cookies from "js-cookie";

const Select = dynamic(() => import("react-select"), { ssr: false });

export default function AddPostPage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [videoLink, setVideoLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("edit");
  const [categories, setCategories] = useState([]);
  const [publishStatus, setPublishStatus] = useState(true);
  const router = useRouter();

  // ตัว editor สำหรับเนื้อหาในฟิลด์หลัก
  const editor = useEditor({
    extensions: [StarterKit, Image.configure({ inline: true }), Underline],
    content: "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl m-0 focus:outline-none min-h-[150px]",
      },
    },
    immediatelyRender: false,
  });

  // editor สำหรับอาการ
  const symptomEditor = useEditor({
    extensions: [StarterKit, Image.configure({ inline: true }), Underline],
    content: "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl m-0 focus:outline-none min-h-[100px]",
      },
    },
  });

  // editor สำหรับสถานการณ์
  const situationEditor = useEditor({
    extensions: [StarterKit, Image.configure({ inline: true }), Underline],
    content: "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl m-0 focus:outline-none min-h-[100px]",
      },
    },
  });

  // editor สำหรับการป้องกัน
  const protectionEditor = useEditor({
    extensions: [StarterKit, Image.configure({ inline: true }), Underline],
    content: "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl m-0 focus:outline-none min-h-[100px]",
      },
    },
  });

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await axios.get(`${API}/category/`);
        setCategories(response.data.resultData || []);
      } catch (error) {
        console.log(error);
      }
    };
    getCategories();
  }, []);

  const handleImageUpload = async (file) => {
    if (!file) {
      toast.error("กรุณาเลือกไฟล์รูปภาพ!");
      return null;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("รองรับเฉพาะไฟล์รูปภาพ!");
      return null;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", `jyvur9yd`);
    formData.append("folder", "icare");

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dcq3ijz0g/image/upload`,
        formData
      );
      return response.data.url;
    } catch (error) {
      console.error(
        "Error uploading image:",
        error.response?.data || error.message
      );
      toast.error("อัปโหลดรูปภาพไม่สำเร็จ");
      return null;
    }
  };

  const addImage = (editorInstance) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;
      const imageUrl = await handleImageUpload(file);
      if (imageUrl && editorInstance) {
        editorInstance.chain().focus().setImage({ src: imageUrl }).run();
      }
    };
  };

  const handleCoverImageUpload = async (file) => {
    const imageUrl = await handleImageUpload(file);
    if (imageUrl) {
      setCoverImage(imageUrl);
    }
  };

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      handleCoverImageUpload(acceptedFiles[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category) {
      toast.error("กรุณาเลือกประเภทข้อมูล");
      return;
    }
    setIsLoading(true);

    try {
      const content = editor?.getHTML() || "";
      const symptom = symptomEditor?.getHTML() || "";
      const situation = situationEditor?.getHTML() || "";
      const protection = protectionEditor?.getHTML() || "";

      const user = Cookies.get("user");
      if (!user) {
        toast.error("กรุณาเข้าสู่ระบบ");
        setIsLoading(false);
        return;
      }
      const userId = JSON.parse(user).id;

      const response = await axios.post(`${API}/posts`, {
        title,
        category_id: category.toString(),
        cover_image_url: coverImage,
        video_link: videoLink,
        content,
        symptom,
        situation,
        protection,
        isActive: publishStatus,
        user_id: userId,
        user_update_id: userId,
      });
      if (response.status === 200) {
        toast.success(response.data.message || "เพิ่มข้อมูลสำเร็จ!");
        router.push("/admin/dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "เพิ่มโพสต์ไม่สำเร็จ");
    } finally {
      setIsLoading(false);
    }
  };

  const renderVideoPreview = (link) => {
    const youtubePattern =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = link.match(youtubePattern);
    if (match) {
      const videoId = match[1];
      return (
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }
    return null;
  };

  const categoryOptions = categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  // Toolbar component สำหรับ editor ย่อย
  const RenderToolbar = ({ editorInstance }) => {
    if (!editorInstance) return null; // ถ้า editor ยังไม่พร้อม แสดงอะไรไม่ได้เลย

    return (
      <div className="flex gap-2 mb-2">
        <button
          type="button"
          onClick={() => editorInstance.chain().focus().toggleBold().run()}
          disabled={!editorInstance.can().chain().focus().toggleBold().run()}
          className={`px-2 py-1 rounded border ${editorInstance.isActive("bold")
              ? "bg-indigo-600 text-white"
              : "bg-white text-gray-800 hover:bg-indigo-100"
            } transition`}
          title="ตัวหนา"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editorInstance.chain().focus().toggleItalic().run()}
          disabled={!editorInstance.can().chain().focus().toggleItalic().run()}
          className={`px-2 py-1 rounded border ${editorInstance.isActive("italic")
              ? "bg-indigo-600 text-white"
              : "bg-white text-gray-800 hover:bg-indigo-100"
            } transition`}
          title="ตัวเอียง"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editorInstance.chain().focus().toggleUnderline().run()}
          disabled={!editorInstance.can().chain().focus().toggleUnderline().run()}
          className={`px-2 py-1 rounded border ${editorInstance.isActive("underline")
              ? "bg-indigo-600 text-white"
              : "bg-white text-gray-800 hover:bg-indigo-100"
            } transition`}
          title="ขีดเส้นใต้"
        >
          U
        </button>
        <button
          type="button"
          onClick={() => addImage(editorInstance)}
          className="px-2 py-1 rounded border bg-white text-gray-800 hover:bg-indigo-100 transition"
          title="แทรกรูปภาพ"
        >
          รูปภาพ
        </button>
      </div>
    );
  };


  return (
    <div className="container mx-auto p-6 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 animate-fade-in-down">
        เพิ่มข้อมูล
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-6 space-y-6 max-w-4xl mx-auto"
      >
        {/* ฟิลด์ข้อมูลหลัก */}
        <div className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              หัวข้อ
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              placeholder="ป้อนหัวข้อ"
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              ประเภทของข้อมูล
            </label>
            <Select
              id="category"
              options={categoryOptions}
              value={categoryOptions.find((option) => option.value === category) || null}
              onChange={(selected) => setCategory(selected?.value || null)}
              placeholder="เลือกประเภทข้อมูล"
              classNamePrefix="react-select"
              className="w-full"
              isClearable
            />
          </div>
        </div>

        {/* หน้าปก */}
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">
            หน้าปกข้อมูล
          </label>
          <div
            {...getRootProps()}
            className="border-dashed border-2 border-gray-300 p-6 text-center cursor-pointer rounded-lg"
          >
            <input {...getInputProps()} />
            <p className="text-gray-500">ลากและวางหรือลือกไฟล์</p>
            {coverImage && (
              <img
                src={coverImage}
                alt="Cover"
                className="max-w-xs max-h-60 w-full h-auto mx-auto rounded-lg mt-4 object-cover shadow"
              />
            )}
          </div>
        </div>

        {/* วิดีโอ */}
        <div>
          <label
            htmlFor="videoLink"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            ลิงก์วิดีโอแนะนำ
          </label>
          <input
            type="url"
            id="videoLink"
            value={videoLink}
            onChange={(e) => setVideoLink(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            placeholder="กรอกลิงก์วิดีโอแนะนำ"
          />
          {videoLink && (
            <div className="mt-4 aspect-video w-full max-w-xl mx-auto rounded-lg overflow-hidden shadow-lg">
              {renderVideoPreview(videoLink)}
            </div>
          )}
        </div>

        {/* สวิตช์สถานะ */}
        <div>
          <label
            htmlFor="publishStatus"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            สถานะเผยแพร่
          </label>
          <Switch
            checked={publishStatus}
            onChange={setPublishStatus}
            offColor="#d1d5db"
            onColor="#4f46e5"
            uncheckedIcon={false}
            checkedIcon={false}
            height={24}
            width={48}
            handleDiameter={22}
            aria-label="Toggle publish status"
          />
        </div>

        {/* แท็บแก้ไขเนื้อหา */}
        <div className="mt-6">
          {/* Mobile dropdown */}
          <select
            className="block sm:hidden w-full p-2 border rounded-md mb-4"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
          >
            <option value="edit">รายละเอียดของโรค</option>
            <option value="symptom">อาการ</option>
            <option value="situation">การติดต่อ</option>
            <option value="protection">ดูแล และ การป้องกัน</option>
          </select>

          {/* Desktop tabs */}
          <div className="hidden sm:flex gap-4 border-b border-gray-200 mb-4">
            {["edit", "symptom", "situation", "protection"].map((tab) => (
              <button
                type="button"
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-semibold rounded-t-lg transition-colors ${activeTab === tab
                    ? "bg-indigo-100 text-indigo-700 border border-b-0 border-indigo-300"
                    : "text-gray-500 hover:text-indigo-600"
                  }`}
              >
                {tab === "edit"
                  ? "รายละเอียดของโรค"
                  : tab === "symptom"
                    ? "อาการ"
                    : tab === "situation"
                      ? "การติดต่อ"
                      : "ดูแล และ การป้องกัน"}
              </button>
            ))}
          </div>

          {/* Editor */}
          {activeTab === "edit" && (
            <>
              <RenderToolbar editorInstance={editor} />
              <EditorContent editor={editor} className="border rounded-md p-4 min-h-[150px]" />
            </>
          )}
          {activeTab === "symptom" && (
            <>
              <RenderToolbar editorInstance={symptomEditor} />
              <EditorContent
                editor={symptomEditor}
                className="border rounded-md p-4 min-h-[100px]"
              />
            </>
          )}
          {activeTab === "situation" && (
            <>
              <RenderToolbar editorInstance={situationEditor} />
              <EditorContent
                editor={situationEditor}
                className="border rounded-md p-4 min-h-[100px]"
              />
            </>
          )}
          {activeTab === "protection" && (
            <>
              <RenderToolbar editorInstance={protectionEditor} />
              <EditorContent
                editor={protectionEditor}
                className="border rounded-md p-4 min-h-[100px]"
              />
            </>
          )}
        </div>

        <div className="mt-8 text-center">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-indigo-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
          </button>
        </div>
      </form>
    </div>
  );
}
