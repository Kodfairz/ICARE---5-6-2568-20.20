'use client';
// ประกาศให้ Next.js รู้ว่านี่เป็น client component

import Navbar from './components/Navbar';
// นำเข้า Navbar component

import { useState, useEffect } from 'react';
// นำเข้า React hooks

import { API } from './service/api';
// นำเข้าค่าพื้นฐาน API endpoint จากไฟล์ service/api

import axios from 'axios';
// ใช้ axios สำหรับเรียก API

import Head from 'next/head';
// ใช้จัดการ <head> ของหน้าเว็บ

import Link from 'next/link';
// ใช้สำหรับสร้างลิงก์ใน Next.js

import { toast } from 'react-toastify';
// ใช้สำหรับแสดง toast notification

export default function Home() {
  const [posts, setPosts] = useState([]);      // เก็บข้อมูลโพสต์แนะนำ
  const [comment, setComment] = useState("");  // เก็บข้อความคอมเมนต์
  const [video, setVideo] = useState([]);      // เก็บข้อมูลวิดีโอแนะนำ

  // ฟังก์ชันดึงวิดีโอแนะนำจาก API
  const getVideo = async () => {
    try {
      const response = await axios.get(`${API}/video/video-recommend`);
      setVideo(response.data.resultData);  // เก็บข้อมูลวิดีโอใน state
    } catch (error) {
      console.log(error);
      // แสดงข้อความผิดพลาดถ้าดึงวิดีโอไม่สำเร็จ
      toast.error(error.response?.message || "ไม่สามารถเรียกวิดีโอได้");
    }
  };

  // ฟังก์ชันดึงโพสต์แนะนำจาก API
  const getPosts = async () => {
    try {
      const response = await axios.get(`${API}/posts/post-recommend`);
      console.log(response);
      setPosts(response.data.resultData);  // เก็บข้อมูลโพสต์ใน state
    } catch (error) {
      console.log(error);
      toast.error(error.response?.message || "ไม่สามารถเรียกข้อมูลได้");
    }
  };

  // ฟังก์ชันส่งข้อความคอมเมนต์ไปยัง API
  const sendMessage = async (event) => {
    try {
      event.preventDefault(); // ป้องกันหน้าเว็บรีเฟรชเมื่อ submit form
      const response = await axios.post(`${API}/comments`, {
        value: comment,
      });
      setComment("");  // เคลียร์ข้อความหลังส่ง
      toast.success("ส่งข้อความสำเร็จ");  // แจ้งเตือนสำเร็จ
      window.scrollTo({ top: 0, behavior: 'smooth' }); // เลื่อนหน้ากลับไปบนสุดอย่างนุ่มนวล
    } catch (error) {
      console.log(error);
      toast.error(error.response?.message || "ไม่สามารถส่งข้อความได้");
    }
  };

  // useEffect เรียกดึงข้อมูลโพสต์และวิดีโอเมื่อ component โหลดครั้งแรก
  useEffect(() => {
    getPosts();
    getVideo();
  }, []);

  return (
    <div className="bg-gradient-to-b from-blue-100 to-white min-h-screen ">
      <Head>
        {/* ส่วนจัดการ head ของ HTML */}
        <h1 className="text-4xl text-gray-800 font-semibold font-anakotmai">iCare@KMUTNB</h1>
        <meta name="description" content="คู่มือโรคและอุบัติเหตุสำหรับคุณ" />
      </Head>

      <Navbar />
      {/* แสดง Navbar ด้านบน */}

      <main className="p-4">
        {/* ส่วนแนะนำหลัก */}
        <section className="text-center py-12">
          <h2 className="text-3xl text-blue-600 font-bold font-anakotmai">รู้ทันทุกสถานการณ์ฉุกเฉิน</h2>
          <h2 className="text-3xl text-blue-600 font-bold font-anakotmai"><center>คู่มือโรคและอุบัติเหตุสำหรับคุณ</center></h2>
          <p className="text-lg text-gray-600 my-4 font-anakotmai">เรียนรู้วิธีป้องกันและจัดการโรคหรืออุบัติเหตุ</p>
        </section>

        {/* ส่วนแสดงโพสต์แนะนำ */}
        <section className="text-center py-8">
          <h3 className="text-xl text-white mb-10 px-4 py-2 bg-green-600 rounded-md max-w-sm ml-0 font-anakotmai">โรคภัยและอุบัติเหตุใกล้ตัว</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {posts.map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center font-anakotmai">
                <img
                  src={item.cover_image_url}
                  alt={item.title}
                  className="w-full h-auto max-h-48 object-contain rounded-xl mb-4"
                />
                <h4 className="text-lg text-gray-700 mb-2">{item.title}</h4>
                <h5 className='mb-2'>ประเภทข้อมูล {item.category.name}</h5>
                <Link href={`/post/${item.id}`} className="inline-block px-6 py-2 text-white bg-blue-500 rounded-md transition duration-300 transform hover:bg-blue-700 hover:scale-105 font-anakotmai">
                  ดูข้อมูล
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ปุ่มลิงก์ไปยังหน้ารวมโพสต์ */}
        <div className="text-center py-8 font-anakotmai">
          <Link href="/posts" className="bg-yellow-600 text-white px-8 py-3 rounded-md mt-4 transition duration-300 hover:bg-yellow-700 focus:outline-none focus:ring-4 focus:ring-blue-500">
            สำรวจโรคเพิ่มเติม
          </Link>
        </div>

        {/* ส่วนแสดงวิดีโอแนะนำ */}
        <h3 className="text-xl text-white mb-10 px-4 py-2 bg-[#006699] rounded-md max-w-sm ml-0 text-center font-anakotmai">
          วิดีโอแนะนำสำหรับปัญหายอดฮิต
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {video.map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center font-anakotmai">
              {/* แสดงภาพ Thumbnail จาก YouTube */}
              <img
                src={item.thumbnail_url}
                alt={item.title}
                className="w-full h-auto max-h-48 object-contain rounded-md mb-4"
              />
              {/* แสดงชื่อวิดีโอ */}
              <h4 className="text-lg text-gray-700 mb-2">{item.title}</h4>
              {/* ปุ่มลิงก์ไปยังหน้าวิดีโอ */}
              <Link
                href={`/video/${item.id}`}
                className="inline-block px-6 py-2 text-white bg-blue-500 rounded-md transition duration-300 transform hover:bg-blue-700 hover:scale-105 font-anakotmai"
              >
                ดูวิดีโอ
              </Link>
            </div>
          ))}
        </div>

        {/* ปุ่มลิงก์ไปหน้ารวมวิดีโอ */}
        <div className="text-center py-8 font-anakotmai">
          <Link href="/video" className="bg-yellow-600 text-white px-8 py-3 rounded-md mt-4 transition duration-300 hover:bg-yellow-700 focus:outline-none focus:ring-4 focus:ring-blue-500">
            สำรวจวิดีเพิ่มเติม
          </Link>
        </div>
      </main>

      {/* ส่วน footer */}
      <footer className="bg-gradient-to-b from-blue-600 to-blue-800 text-white text-center py-8 mt-12">
        <div className="flex flex-col md:flex-row justify-between items-start px-4 max-w-6xl mx-auto">
          {/* ข้อมูล iCARE KMUTNB */}
          <div className="w-full md:w-3/5 text-left mb-8 md:mb-0 font-anakotmai">
            <h4 className="text-2xl font-bold text-blue-300">iCARE KMUTNB</h4>
            <p>เวลาทำการ: 08:00 - 17:00 น.</p>
            <p>ที่อยู่: 129 หมู่ 21 บ้านเนินหอม หมู่ 4, ตำบลเมืองปราจีนบุรี จังหวัดปราจีนบุรี, รหัสไปรษณีย์ 25000 , ประเทศไทย</p>
          </div>

          {/* ข้อมูลติดต่อ (อีเมล, เบอร์โทรศัพท์) */}
          <div className="w-full md:w-2/5 text-left mt-8 md:mt-0 font-anakotmai">
            <h4 className="text-xl font-bold text-blue-300 mb-4">ติดต่อเรา</h4>
            <p className="flex items-center space-x-2">
              <span role="img" aria-label="email">📧</span>
              <span>อีเมล: nuseroomfitf@gmail.com</span>
            </p>
            <p className="flex items-center space-x-2">
              <span role="img" aria-label="phone">📞</span>
              <span>เบอร์โทร: 08-8927-2849</span>
            </p>
          </div>

          {/* ฟอร์มส่งข้อความถึงเรา */}
          <div className="w-full md:w-2/5 font-anakotmai mt-8 md:mt-0">
            <h4 className="text-xl font-bold text-blue-300 mb-4">ส่งข้อความหาเรา</h4>
            <form onSubmit={sendMessage}>
              <input
                type="text"
                value={comment}
                placeholder="พิมพ์ข้อความของคุณ..."
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md mb-4 text-black"
                required
              />
              <button
                type="submit"
                className="bg-green-600 text-white px-8 py-3 rounded-md transition duration-300 hover:bg-green-700"
              >
                ส่ง
              </button>
            </form>
          </div>
        </div>

        {/* ลิขสิทธิ์ */}
        <p className="mt-4">&copy; 2024 iCare@KMUTNB</p>
      </footer>
    </div>
  );
}
