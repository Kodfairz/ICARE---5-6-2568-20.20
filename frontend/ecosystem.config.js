module.exports = {
    apps: [
      {
        name: "icare-app", // ชื่อแอปใน PM2
        script: "npm", // ใช้ npm เป็น script
        args: "start", // คำสั่งรัน Next.js production server
        env: {
          NODE_ENV: "production", // สภาพแวดล้อม
          PORT: 3000 // กำหนดพอร์ต (ถ้าต้องการเปลี่ยน)
        },
        instances: 1, // จำนวน instance (ปรับได้ถ้าต้องการ scale)
        autorestart: true, // รีสตาร์ทอัตโนมัติเมื่อ crash
        watch: false, // ไม่ต้อง watch ไฟล์ใน production
        max_memory_restart: "1G" // รีสตาร์ทถ้าใช้ RAM เกิน 1GB
      }
    ]
  };