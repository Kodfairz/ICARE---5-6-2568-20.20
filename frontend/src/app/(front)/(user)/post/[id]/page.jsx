"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../../../../service/api";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import * as dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/th";

const PostDetail = () => {
  dayjs.locale("th");
  dayjs.extend(relativeTime);

  const { id } = useParams();

  const [post, setPost] = useState({});
  const [activeTab, setActiveTab] = useState("content");
  const [fadeIn, setFadeIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getPost = async () => {
    try {
      const response = await axios.get(`${API}/posts/user/${id}`);
      setPost(response.data.resultData);
      setIsLoading(false);
      setFadeIn(true); // เปิด animation ตอนโหลดข้อมูลเสร็จ
    } catch (error) {
      console.log(error);
      toast.error(error.response?.message || "ไม่สามารถเรียกข้อมูลได้");
      setIsLoading(false);
    }
  };

  const renderVideoPreview = (link) => {
    if (typeof link === "string" && link) {
      const youtubePattern =
        /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
      const match = link.match(youtubePattern);
      if (match) {
        const videoId = match[1];
        return (
          <div className="relative w-full max-w-full pb-[56.25%] rounded-lg overflow-hidden shadow-lg">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        );
      }
    }
    return null;
  };

  useEffect(() => {
    getPost();
  }, []);

  // ทำ fade-in + slide-in ทุกครั้งเมื่อ activeTab เปลี่ยน (ถ้าโหลดข้อมูลเสร็จแล้ว)
  useEffect(() => {
    if (!isLoading) {
      setFadeIn(false);
      const timeout = setTimeout(() => setFadeIn(true), 350); // delay เล็กน้อยให้ smooth
      return () => clearTimeout(timeout);
    }
  }, [activeTab, isLoading]);

  const renderHTML = (html) => (
    <div
      className="prose prose-sm sm:prose lg:prose-lg max-w-full text-gray-800"
      dangerouslySetInnerHTML={{ __html: html || "-" }}
    />
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-3 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 break-words">
          {post?.title}
        </h1>
        <h2 className="text-base sm:text-lg text-indigo-600 font-semibold mb-6 break-words">
          {post?.category ? `ประเภทข้อมูล: ${post.category.name}` : "ประเภทข้อมูล: -"}
        </h2>

        {post?.cover_image_url && (
          <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
            <img
              src={post.cover_image_url}
              alt={post.title || "Cover Image"}
              className="w-full h-auto object-cover max-w-full"
              loading="lazy"
            />
          </div>
        )}

        {/* ปุ่มสลับฟิลด์ข้อมูล */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {["content", "symptom", "situation", "protection"].map((field) => {
            let label = "";
            if (field === "content") label = "รายละเอียดของโรค";
            else if (field === "symptom") label = "อาการของโรค";
            else if (field === "situation") label = "การติดต่อ";
            else if (field === "protection") label = "วิธีดูแล และ การป้องกัน";

            return (
              <button
                key={field}
                onClick={() => setActiveTab(field)}
                className={`px-5 py-2 rounded-lg font-semibold transition text-sm sm:text-base
                  ${
                    activeTab === field
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-300"
                      : "bg-gray-200 text-gray-700 hover:bg-indigo-100"
                  }`}
                type="button"
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* แสดงข้อมูลตามปุ่มที่เลือก พร้อม effect fade-in + slide-in */}
        <div
          key={activeTab}
          className={`max-w-3xl mx-auto bg-white rounded-lg shadow-md border border-gray-300 p-4 sm:p-6 text-base sm:text-lg min-h-[150px] prose max-w-full break-words overflow-x-auto
            transition-opacity transition-transform duration-700 ease-out
            will-change-opacity will-change-transform
            ${
              fadeIn
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
        >
          {activeTab === "content" && renderHTML(post?.content.detail)}
          {activeTab === "symptom" && renderHTML(post?.symptom.detail)}
          {activeTab === "situation" && renderHTML(post?.situation.detail)}
          {activeTab === "protection" && renderHTML(post?.protection.detail)}
        </div>

        {/* วิดีโอแนะนำ */}
        {post?.video_link && post.video_link.length > 5 && (
          <section className="mt-10 max-w-4xl mx-auto px-2 sm:px-0">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-5">
              วิดีโอแนะนำ
            </h3>
            {renderVideoPreview(post.video_link)}
          </section>
        )}

        {/* ข้อมูลเพิ่มเติม */}
        <section className="mt-10 max-w-4xl mx-auto px-2 sm:px-0 text-gray-600 space-y-2 text-xs sm:text-sm md:text-base">
          <div>
            จำนวนผู้เข้าชม:{" "}
            <span className="font-semibold">{post?.views ?? "-"}</span>
          </div>
          <div>
            เผยแพร่ล่าสุด:{" "}
            <span className="font-semibold">
              {post?.updated_at
                ? dayjs(post.updated_at).format("DD MMMM YYYY")
                : "-"}
            </span>
          </div>
          <div>
            ผู้เผยแพร่:{" "}
            <span className="font-semibold">
              {post?.users_posts_user_idTousers?.username ?? "-"}
            </span>
          </div>
          <div>
            ผู้แก้ไขล่าสุด:{" "}
            <span className="font-semibold">
              {post?.users_posts_user_update_idTousers?.username ?? "-"}
            </span>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PostDetail;
