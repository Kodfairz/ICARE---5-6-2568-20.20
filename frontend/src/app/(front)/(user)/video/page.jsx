"use client";

import { useState, useEffect } from "react";
import { API } from "../../../service/api";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { toast } from "react-toastify";

export default function VideoAll() {
  const [video, setVideo] = useState([]);

  const getVideo = async () => {
    try {
      const response = await axios.get(`${API}/video`);
      setVideo(response.data.resultData);
    } catch (error) {
      console.log(error);
      toast.error(error.response.message || "ไม่สามารถเรียกวิดีโอได้");
    }
  };

  useEffect(() => {
    getVideo();
  }, []);

  return (
    <div className="bg-gradient-to-b from-blue-100 to-white min-h-screen ">
      <main className="p-4">
        <h1 className="text-3xl sm:text-4xl text-gray-800 font-semibold font-anakotmai text-center mb-6 sm:mb-8">
          iCare@KMUTNB
        </h1>

        <h3 className="text-xl text-white mb-10 px-4 py-2 bg-[#006699] rounded-md max-w-sm ml-0 text-center font-anakotmai">
          วิดีโอแนะนำสำหรับปัญหายอดฮิต
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {video.map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md text-center font-anakotmai"
            >
              {/* ดึงภาพ Thumbnail จาก YouTube */}
              <img
                src={item.thumbnail_url}
                alt={item.title}
                className="w-full h-auto max-h-48 object-contain rounded-md mb-4"
              />
              {/* ชื่อวิดีโอ */}
              <h4 className="text-lg text-gray-700 mb-2">{item.title}</h4>
              {/* ปุ่มลิงก์ไปยัง YouTube */}
              <Link
                href={`/video/${item.id}`}
                className="inline-block px-6 py-2 text-white bg-blue-500 rounded-md transition duration-300 transform hover:bg-blue-700 hover:scale-105 font-anakotmai"
              >
                ดูวิดีโอ
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
