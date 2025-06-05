"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import { API } from "../../../../service/api";

// ฟังก์ชัน component สำหรับแสดงวิดีโอ
const Video = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [fadeIn, setFadeIn] = useState(false);
  const [visibleDetails, setVisibleDetails] = useState(false);

  // ref สำหรับรายละเอียดส่วนล่าง (thumbnail + user info)
  const detailsRef = useRef(null);

  const getVideoById = async () => {
    try {
      const response = await axios.get(`${API}/video/${id}`);
      setVideo(response.data.resultData);
      setFadeIn(true); // เปิด animation ตอนโหลดข้อมูลเสร็จ
    } catch (error) {
      toast.error(error.response?.message || "ไม่สามารถเรียกวิดีโอได้");
    }
  };

  useEffect(() => {
    getVideoById();
  }, [id]);

  // IntersectionObserver สำหรับรายละเอียด (thumbnail, user info)
  useEffect(() => {
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleDetails(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (detailsRef.current) observer.observe(detailsRef.current);

    return () => {
      if (detailsRef.current) observer.unobserve(detailsRef.current);
    };
  }, [video]);

  const renderVideoPreview = (link) => {
    if (typeof link === "string" && link) {
      const youtubePattern =
        /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
      const match = link.match(youtubePattern);
      if (match) {
        const videoId = match[1];
        return (
          <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg shadow-lg">
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
    return <p className="text-red-500">ไม่สามารถแสดงวิดีโอได้</p>;
  };

  if (!video) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-xl animate-pulse">กำลังโหลด...</span>
      </div>
    );
  }

  // animation fade-in + slide-in ตอนโหลดข้อมูลเสร็จ
  const fadeInClass = fadeIn
    ? "opacity-100 translate-y-0 transition-opacity transition-transform duration-700 ease-out"
    : "opacity-0 translate-y-6 transition-opacity transition-transform duration-700 ease-out";

  // animation fade-in + slide-up สำหรับรายละเอียดตอน scroll ลงมา
  const detailsClass = visibleDetails
    ? "opacity-100 translate-y-0 transition-opacity transition-transform duration-700 ease-out"
    : "opacity-0 translate-y-8 transition-opacity transition-transform duration-700 ease-out";

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* ชื่อวิดีโอ */}
      <h1
        className={`text-3xl font-bold mb-4 text-gray-800 ${fadeInClass}`}
      >
        {video.title}
      </h1>

      {/* preview วิดีโอ */}
      <div className={fadeInClass}>{renderVideoPreview(video.url)}</div>

      {/* คำอธิบายวิดีโอ */}
      <p className={`mt-4 text-gray-600 whitespace-pre-line ${fadeInClass}`}>
        {video.description}
      </p>

      {/* ข้อมูลเพิ่มเติม (thumbnail + user info) */}
      <div
        ref={detailsRef}
        className={`mt-6 flex items-center gap-4 ${detailsClass}`}
      >
        <img
          src={video.thumbnail_url}
          width={120}
          height={70}
          alt={video.title}
          className="rounded-md shadow-md object-cover"
        />
        <div>
          <p className="text-sm text-gray-500">
            สร้างโดย: {video.users_video_links_user_idTousers.username}
          </p>
          <p className="text-sm text-gray-500">
            อัปเดตล่าสุดโดย: {video.users_video_links_update_idTousers.username}
          </p>
          <p className="text-sm text-gray-500">
            สร้างเมื่อ: {new Date(video.created_at).toLocaleDateString("th-TH")}
          </p>
          <p className="text-sm text-gray-500">
            อัปเดตล่าสุด: {new Date(video.updated_at).toLocaleDateString("th-TH")}
          </p>
          <p className="text-sm text-gray-500">ดูแล้ว: {video.views} ครั้ง</p>
          <span
            className={`inline-block mt-2 px-2 py-1 rounded ${
              video.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {video.isActive ? "เผยแพร่แล้ว" : "ยังไม่เผยแพร่"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Video;
