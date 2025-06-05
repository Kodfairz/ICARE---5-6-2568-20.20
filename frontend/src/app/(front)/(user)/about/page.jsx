'use client';
import React, { useState, useEffect } from 'react';

const AboutPage = () => {
  const [fadeIn, setFadeIn] = useState(false);

  const info = {
    description: [
      `ยินดีต้อนรับสู่ Icare@KMUTNB – เว็บแอปพลิเคชันที่พัฒนาขึ้นเพื่อให้ความรู้เกี่ยวกับโรคทั่วไป การปฐมพยาบาล และการดูแลสุขภาพอย่างถูกต้อง เชื่อถือได้ และเข้าถึงได้ง่ายสำหรับทุกคน`,
      `ในปัจจุบัน การเข้าถึงข้อมูลด้านสุขภาพขั้นพื้นฐานเป็นสิ่งสำคัญอย่างยิ่ง เนื่องจากอุบัติเหตุและความเจ็บป่วยสามารถเกิดขึ้นได้โดยไม่คาดคิด การไม่มีความรู้หรือความเข้าใจเกี่ยวกับการดูแลเบื้องต้นหรือการปฐมพยาบาลอาจนำไปสู่การดูแลที่ล่าช้าหรือผิดวิธี ซึ่งอาจส่งผลร้ายแรงต่อสุขภาพของผู้ป่วย`,
      `Icare@KMUTNB จึงถือกำเนิดขึ้นจากแนวคิดในการสร้างแพลตฟอร์มที่ให้ข้อมูลที่ถูกต้อง ทันสมัย และมีความน่าเชื่อถือ เพื่อส่งเสริมให้ประชาชนทั่วไปสามารถดูแลตนเองและผู้อื่นได้อย่างเหมาะสมในสถานการณ์ฉุกเฉิน`,
      `ด้วยความตั้งใจในการยกระดับความรู้ด้านสุขภาพของสังคม เราหวังว่าเว็บแอปพลิเคชันนี้จะเป็นอีกหนึ่งเครื่องมือสำคัญในการส่งเสริมสุขภาวะของคนไทย`
    ],
    team: [
      {
        name: 'นาย กมลภพ วงศ์ปาน',
        role: 'ผู้พัฒนา',
        image: '/team/kamonphob.jpg',
      },
      {
        name: 'นางสาว ธัญภัทร์ มณฑา',
        role: 'ผู้พัฒนา',
        image: '/team/Thanya.jpg',
      },
    ],
    founded: 2024,
  };

  useEffect(() => {
    const timer = setTimeout(() => setFadeIn(true), 100); // delay เล็กน้อยก่อนเริ่ม animation
    return () => clearTimeout(timer);
  }, []);

  const fadeInClass = fadeIn
    ? 'opacity-100 translate-y-0 transition-opacity transition-transform duration-700 ease-out'
    : 'opacity-0 translate-y-6 transition-opacity transition-transform duration-700 ease-out';

  return (
    <main className="text-black overflow-x-hidden max-w-full">
      {/* HERO SECTION */}
      <section className={`bg-blue-800 text-white py-20 relative overflow-hidden ${fadeInClass}`}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col items-center justify-center text-center">
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-4">ABOUT US</h1>
          <p className="text-xl sm:text-2xl font-medium">เกี่ยวกับเรา</p>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-16 bg-white rotate-2 origin-top-left scale-x-150"></div>
      </section>

      {/* CONTENT SECTION */}
      <section className="max-w-4xl mx-auto px-6 py-12 text-gray-700 text-lg leading-relaxed space-y-6">
        <h2 className={`text-3xl font-bold text-blue-700 mb-4 ${fadeInClass}`}>
          ความเป็นมาของ Icare@KMUTNB
        </h2>
        {info.description.map((paragraph, index) => (
          <p key={index} className={fadeInClass}>
            {paragraph}
          </p>
        ))}

        <div className="mt-16">
          <h2 className={`text-2xl font-semibold mb-6 ${fadeInClass}`}>ทีมงานของเรา</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {info.team.map((member, index) => (
              <div
                key={index}
                className={`bg-gray-800 text-white rounded-2xl shadow-md transition-transform hover:shadow-xl hover:scale-105 p-6 flex flex-col items-center text-center group ${fadeInClass}`}
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-700 mb-4 transition-transform duration-300 group-hover:scale-110"
                />
                <h3 className="text-xl font-semibold transition duration-300 group-hover:text-white group-hover:-translate-y-1">
                  {member.name}
                </h3>
                <p className="text-gray-400 transition duration-300 group-hover:text-gray-200 group-hover:-translate-y-0.5">
                  {member.role}
                </p>
              </div>
            ))}
          </div>

          <h2 className={`text-xl text-gray-400 mt-12 ${fadeInClass}`}>
            ก่อตั้งเมื่อปี {info.founded}
          </h2>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
