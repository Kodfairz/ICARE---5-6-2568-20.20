import { Elysia } from 'elysia';             // นำเข้า Elysia framework สำหรับสร้าง API server
import { PrismaClient } from '@prisma/client';  // นำเข้า PrismaClient สำหรับเชื่อมต่อฐานข้อมูล

const prisma = new PrismaClient();           // สร้าง instance ของ PrismaClient เพื่อใช้ query database

// กำหนด route group ที่มี prefix เป็น /video
export const videoRoutes = new Elysia({ prefix : "/video" })
.get("/", async () => {                       // GET /video : ดึงข้อมูลวิดีโอทั้งหมด
    const video = await prisma.video_links.findMany({
        // query แบบไม่มีเงื่อนไข คือดึงข้อมูลทั้งหมด
    })

    if(!video) {                             // ถ้าไม่มีข้อมูลวิดีโอ
        throw new Error("ไม่สามารถเรียกวิดีโอได้");  // โยน error แจ้งว่าไม่สามารถดึงข้อมูลได้
    }

    return {
        "resultData" : video                  // ส่งข้อมูลวิดีโอทั้งหมดกลับไป
    }
})
.get("/video-recommend", async () => {       // GET /video/video-recommend : ดึงวิดีโอแนะนำ
    const video = await prisma.video_links.findMany({
        orderBy: {
            views: 'desc',                   // เรียงตามจำนวนวิวมากไปน้อย
        },
        take: 6 ,                           // เอาแค่ 6 รายการ
        where : {
            isActive : true                  // เฉพาะวิดีโอที่ active เท่านั้น
        }
    });

    if(!video) {                            // ถ้าไม่มีข้อมูล
        throw new Error("ไม่สามารถเรียกวิดีโอได้");  // โยน error
    }

    return {
        "resultData" : video                 // ส่งข้อมูลวิดีโอแนะนำกลับ
    }
})
.get("/user", async () => {                  // GET /video/user : ดึงวิดีโอที่ active ทั้งหมด (เหมือน /video)
    const video = await prisma.video_links.findMany({
        where : {
            isActive : true                  // เฉพาะวิดีโอ active
        }
    })

    if(!video) {                            // ถ้าไม่มีข้อมูล
        throw new Error("ไม่สามารถเรียกวิดีโอได้");  // โยน error
    }

    return {
        "resultData" : video                 // ส่งข้อมูลวิดีโอกลับ
    }
})
.post("/", async ({ body }) => {             // POST /video : เพิ่มวิดีโอใหม่
    const video = await prisma.video_links.findFirst({
        where : {
            title : body.title               // ตรวจสอบว่ามีวิดีโอที่ชื่อเดียวกันหรือไม่
        }
    })

    if(video) {                             // ถ้ามีชื่อซ้ำ
        throw new Error("ชื่อวิดีโอซ้ำ")       // โยน error แจ้งชื่อซ้ำ
    }

    const newVideo = await prisma.video_links.create({
        data : {                            // สร้างวิดีโอใหม่ในฐานข้อมูล
            title : body.title,
            url : body.url,
            description : body.description,
            isActive : true,                // ตั้งสถานะเริ่มต้นเป็น active
            thumbnail_url : body.thumbnail_url,
            user_id : Number(body.user_id),   // แปลง user_id เป็นตัวเลข
            update_id  : Number(body.update_id), // แปลง update_id เป็นตัวเลข
            views : 0                      // จำนวนวิวเริ่มต้น 0
        }
    })

    if(!newVideo) {                         // ถ้าเพิ่มวิดีโอไม่สำเร็จ
        throw new Error("ไม่สามารถเพิ่มวิดีโอได้");
    }

    return {
        "message" : "เพิ่มวิดีโอสำเร็จ"       // แจ้งผลสำเร็จ
    }
})
.put("/:id", async ({ body, params }) => {  // PUT /video/:id : แก้ไขข้อมูลวิดีโอตาม id
    const video = await prisma.video_links.findFirst({
        where : {
            id : Number(params.id)            // หา video ที่มี id ตรงกับ param
        }
    })

    if(!video) {                            // ถ้าไม่เจอวิดีโอ
        throw new Error("ไม่เจอวิดีโอ")
    }

    const updateVideo = await prisma.video_links.update({
        where : {
            id : Number(params.id)            // อัปเดตวิดีโอตาม id
        },
        data : {
            title : body.title,
            url : body.url,
            description : body.description,
            isActive : body.isActive,       // อัปเดตสถานะ active
            thumbnail_url : body.thumbnail_url,
            update_id  : Number(body.update_id),  // อัปเดต update_id
        }
    })

    if(!updateVideo) {                      // ถ้าแก้ไขไม่สำเร็จ
        throw new Error("แก้ไขวิดีโอไม่สำเร็จ")
    }

    return {
        "message" : "แก้ไขวิดีโอสำเร็จ"        // แจ้งผลสำเร็จ
    }
})
.get("/:id", async ({ params }) => {         // GET /video/:id : ดึงข้อมูลวิดีโอตาม id
    const video = await prisma.video_links.findFirst({
        where : {
            id : Number(params.id)            // หา video ตาม id
        },
        include : {                          // รวมข้อมูลผู้ใช้ที่เกี่ยวข้องกับ video
            users_video_links_update_idTousers : true,
            users_video_links_user_idTousers : true
        }
    })

    if(!video) {                            // ถ้าไม่เจอวิดีโอ
        throw new Error("ไม่มีวิดีโอ")
    }

    const updateVideo = await prisma.video_links.update({
        where : {
            id : Number(params.id)            // อัปเดตจำนวนวิวเพิ่ม 1
        },
        data : {
            views : video.views + 1
        }
    })

    return {
        "resultData" : video                 // ส่งข้อมูลวิดีโอกลับ
    }
})
.delete("/:id", async ({ params }) => {      // DELETE /video/:id : ลบวิดีโอตาม id
    const video = await prisma.video_links.findFirst({
        where : {
            id : Number(params.id)            // หา video ตาม id
        }
    })

    if(!video) {                            // ถ้าไม่เจอวิดีโอ
        throw new Error("ไม่มีวิดีโอ");
    }

    const deleteVideo = await prisma.video_links.delete({
        where : {
            id : Number(params.id)            // ลบวิดีโอตาม id
        }
    })

    if(!deleteVideo) {                      // ถ้าลบไม่สำเร็จ
        throw new Error("ลบวิดีโอไม่สำเร็จ")
    }

    return {
        "message" : "ลบวิดีโอสำเร็จ"          // แจ้งผลสำเร็จ
    }
})
.patch("/change-status/:id", async ({ body, params }) => {  // PATCH /video/change-status/:id : เปลี่ยนสถานะ isActive
    const video = await prisma.video_links.findFirst({
        where : {
            id : Number(params.id)            // หา video ตาม id
        }
    })

    if(!video) {                            // ถ้าไม่เจอวิดีโอ
        throw new Error("ไม่เจอวิดีโอ")
    }

    const updateVideo = await prisma.video_links.update({
        data : {
            isActive : body.isActive,        // อัปเดตสถานะ isActive
            updated_at : new Date()          // อัปเดตวันที่แก้ไขเป็นปัจจุบัน
        },
        where : {
            id : Number(params.id)
        }
    })

    if(!updateVideo) {                      // ถ้าเปลี่ยนสถานะไม่สำเร็จ
        throw new Error("ไม่สามารถเปลี่ยนแปลงสถานะการเผยแพร่ได้")
    }

    return {
        "message" : "เปลี่ยนสถานะสำเร็จ"      // แจ้งผลสำเร็จ
    }

})
