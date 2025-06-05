"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import axios from "axios";
import { toast } from "react-toastify";
import { API } from "../../../../../service/api";
import Switch from "react-switch";
import dynamic from "next/dynamic";
import { useDropzone } from "react-dropzone";
import Cookies from "js-cookie";

const Select = dynamic(() => import("react-select"), { ssr: false });

export default function EditPostPage() {
  const { id } = useParams();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [videoLink, setVideoLink] = useState("");
  const [publishStatus, setPublishStatus] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("edit");
  const [categories, setCategories] = useState([]);
  const [isVideoValid, setIsVideoValid] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit, Image.configure({ inline: true }), Underline],
    content: "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl m-0 focus:outline-none min-h-[150px]",
      },
    },
  });

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
    const fetchData = async () => {
      try {
        const [postRes, catRes] = await Promise.all([
          axios.get(`${API}/posts/${id}`),
          axios.get(`${API}/category/`),
        ]);

        const post = postRes.data.resultData;
        setTitle(post.title);
        setCategory(post.category_id);
        setCoverImage(post.cover_image_url);
        setVideoLink(post.video_link);
        setPublishStatus(post.isActive);

        editor?.commands.setContent(post.content.detail);
        symptomEditor?.commands.setContent(post.symptom.detail);
        situationEditor?.commands.setContent(post.situation.detail);
        protectionEditor?.commands.setContent(post.protection.detail);

        setCategories(catRes.data.resultData);
      } catch (err) {
        toast.error("โหลดข้อมูลไม่สำเร็จ");
      }
    };
    fetchData();
  }, [id, editor, symptomEditor, situationEditor, protectionEditor]);

  // ฟังก์ชันดึง videoId จากลิงก์ YouTube
  const getYouTubeVideoId = (link) => {
    if (!link) return null;
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = link.match(regex);
    return match ? match[1] : null;
  };

  // เช็ค validity ของลิงก์วิดีโอทุกครั้งที่เปลี่ยน videoLink
  useEffect(() => {
    const videoId = getYouTubeVideoId(videoLink);
    setIsVideoValid(!!videoId);
  }, [videoLink]);

  const categoryOptions = categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  const handleImageUpload = async (file) => {
    if (!file.type.startsWith("image/")) return null;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "jyvur9yd");
    formData.append("folder", "icare");
    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/dcq3ijz0g/image/upload`,
        formData
      );
      return res.data.url;
    } catch (err) {
      toast.error("อัปโหลดภาพไม่สำเร็จ");
      return null;
    }
  };

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const url = await handleImageUpload(acceptedFiles[0]);
      if (url) setCoverImage(url);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category) return toast.error("กรุณาเลือกประเภทข้อมูล");
    setIsLoading(true);

    try {
      const content = editor?.getHTML() || "";
      const symptom = symptomEditor?.getHTML() || "";
      const situation = situationEditor?.getHTML() || "";
      const protection = protectionEditor?.getHTML() || "";

      const user = JSON.parse(Cookies.get("user"));
      const userId = user.id;

      const res = await axios.put(`${API}/posts/${id}`, {
        title,
        category_id: category,
        cover_image_url: coverImage,
        video_link: videoLink,
        content,
        symptom,
        situation,
        protection,
        isActive: publishStatus,
        user_update_id: userId,
      });

      toast.success(res.data.message || "อัปเดตข้อมูลสำเร็จ");
      router.push("/admin/dashboard");
    } catch (err) {
      toast.error("อัปเดตข้อมูลไม่สำเร็จ");
    } finally {
      setIsLoading(false);
    }
  };

  const renderVideoPreview = (videoId) => {
    if (!videoId) return null;
    return (
      <div className="mt-4 rounded-lg border-4 border-red-500 overflow-hidden shadow-lg max-w-xl mx-auto">
        <iframe
          className="w-full aspect-video"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video preview"
          allowFullScreen
        />
      </div>
    );
  };

  const RenderToolbar = ({ editorInstance }) => {
    if (!editorInstance) return null;
    return (
      <div className="flex gap-2 mb-2">
        {["bold", "italic", "underline"].map((cmd) => (
          <button
            key={cmd}
            type="button"
            onClick={() =>
              editorInstance
                .chain()
                .focus()[`toggle${cmd[0].toUpperCase() + cmd.slice(1)}`]()
                .run()
            }
            className={`px-2 py-1 border rounded ${
              editorInstance.isActive(cmd)
                ? "bg-indigo-500 text-white"
                : "bg-white text-gray-800"
            }`}
          >
            {cmd.charAt(0).toUpperCase()}
          </button>
        ))}
        <button
          type="button"
          onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.click();
            input.onchange = async () => {
              const file = input.files[0];
              if (!file) return;
              const url = await handleImageUpload(file);
              if (url)
                editorInstance.chain().focus().setImage({ src: url }).run();
            };
          }}
          className="px-2 py-1 border rounded bg-white text-gray-800"
        >
          รูปภาพ
        </button>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">แก้ไขโพสต์</h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
        <input
          className="w-full border rounded p-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="หัวข้อโพสต์"
        />

        <Select
          options={categoryOptions}
          value={categoryOptions.find((c) => c.value === category) || null}
          onChange={(opt) => setCategory(opt?.value || null)}
        />

        <div
          {...getRootProps()}
          className="border-dashed border-2 p-6 text-center rounded-lg"
        >
          <input {...getInputProps()} />
          <p>ลากหรือคลิกเพื่อเลือกรูปหน้าปก</p>
          {coverImage && (
            <img
              src={coverImage}
              alt="cover"
              className="mt-4 w-full max-h-60 object-cover rounded"
            />
          )}
        </div>

        <input
          className="w-full border rounded p-2"
          value={videoLink}
          onChange={(e) => setVideoLink(e.target.value)}
          placeholder="ลิงก์วิดีโอ YouTube"
        />

        {/* แสดงพรีวิววิดีโอ ถ้าวิดีโอถูกต้อง */}
        {isVideoValid && renderVideoPreview(getYouTubeVideoId(videoLink))}

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

        <div>
          <div className="flex gap-4 border-b">
            {["edit", "symptom", "situation", "protection"].map((tab) => (
              <button
                type="button"
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 ${
                  activeTab === tab
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-500"
                }`}
              >
                {tab === "edit"
                  ? "รายละเอียดของโรค"
                  : tab === "symptom"
                  ? "อาการ"
                  : tab === "situation"
                  ? "การติดต่อ"
                  : "วิธีดูแล และ การป้องกัน"}
              </button>
            ))}
          </div>

          <div className="mt-4">
            {activeTab === "edit" && (
              <>
                <RenderToolbar editorInstance={editor} />
                <EditorContent
                  editor={editor}
                  className="border rounded p-4 min-h-[150px]"
                />
              </>
            )}
            {activeTab === "symptom" && (
              <>
                <RenderToolbar editorInstance={symptomEditor} />
                <EditorContent
                  editor={symptomEditor}
                  className="border rounded p-4 min-h-[100px]"
                />
              </>
            )}
            {activeTab === "situation" && (
              <>
                <RenderToolbar editorInstance={situationEditor} />
                <EditorContent
                  editor={situationEditor}
                  className="border rounded p-4 min-h-[100px]"
                />
              </>
            )}
            {activeTab === "protection" && (
              <>
                <RenderToolbar editorInstance={protectionEditor} />
                <EditorContent
                  editor={protectionEditor}
                  className="border rounded p-4 min-h-[100px]"
                />
              </>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-700"
        >
          {isLoading ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
        </button>
      </form>
    </div>
  );
}
