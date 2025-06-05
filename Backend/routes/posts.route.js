import { Elysia } from 'elysia'; // นำเข้า Elysia framework สำหรับสร้าง API
import { PrismaClient } from '@prisma/client'; // นำเข้า PrismaClient สำหรับเชื่อมต่อฐานข้อมูล

const prisma = new PrismaClient(); // สร้าง Prisma client instance

// สร้าง router สำหรับเส้นทาง /posts
export const postRoutes = new Elysia({ prefix: "/posts" })

    // POST /posts - สร้างโพสต์ใหม่
    .post("/", async ({ body }) => {
        // ตรวจสอบว่า title ซ้ำหรือไม่
        const post = await prisma.posts.findFirst({
            where : { title : body.title }
        })

        if(post) throw new Error("มีข้อมูลนี้แล้ว");

        const newContent = await prisma.content.create({
            data: {
                detail: body.content,
            }
        })

        const newProtection = await prisma.protection.create({
            data: {
                detail: body.protection,
            }
        })

        const newSituation = await prisma.situation.create({
            data: {
                detail: body.situation,
            }
        })

        const newSymptom = await prisma.symptom.create({
            data: {
                detail: body.symptom,
            }
        })

        // สร้างโพสต์ใหม่
        const newPost = await prisma.posts.create({
            data : {
                title : body.title,
                category_id : Number(body.category_id),
                content_id : newContent.id,
                protection_id : newProtection.id,
                situation_id : newSituation.id,
                symptom_id : newSymptom.id,
                cover_image_url : body.cover_image_url,
                video_link : body.video_link,
                isActive : body.isActive,
                user_id : Number(body.user_id),
                user_update_id : Number(body.user_id)
            }
        })

        if(!newPost) throw new Error("เพิ่มข้อมูลไม่สำเร็จ");

        return { "message" : "เพิ่มข้อมูลสำเร็จแล้ว" };
    })

    // GET /posts - ดึงโพสต์ทั้งหมดที่เปิดเผยอยู่ (isActive)
    .get("/", async () => {
        const posts = await prisma.posts.findMany({
            where : { isActive : true },
            include : { category : true }
        })

        if(!posts) throw new Error("ไม่สามารถเรียกข้อมูลได้");

        return { "resultData" : posts };
    })

    // GET /posts/post-recommend - ดึงโพสต์ยอดนิยม (views มากสุด 6 อันดับ)
    .get("/post-recommend", async () => {
        const posts = await prisma.posts.findMany({
            orderBy: { views: 'desc' },
            include : { category : true },
            where : { isActive : true },
            take: 6 
        });

        if(!posts) throw new Error("ไม่สามารถเรียกข้อมูลได้");

        return { "resultData" : posts };
    })

    // GET /posts/admin - ดึงโพสต์ทั้งหมด (รวมโพสต์ที่ไม่ active)
    .get("/admin", async () => {
        const posts = await prisma.posts.findMany({
            include : { category : true }
        })

        if(!posts) throw new Error("ไม่สามารถเรียกข้อมูลได้");

        return { "resultData" : posts };
    })

    // PATCH /posts/change-status/:id - เปลี่ยนสถานะการเผยแพร่ของโพสต์
    .patch("/change-status/:id", async ({ body, params }) => {
        const post = await prisma.posts.findFirst({
            where : { id : Number(params.id) }
        })

        if(!post) throw new Error("ไม่เจอข้อมูล");

        const updatePost = await prisma.posts.update({
            data : {
                isActive : body.isActive,
                updated_at : new Date()
            },
            where : { id : Number(params.id) }
        })

        if(!updatePost) throw new Error("ไม่สามารถเปลี่ยนแปลงสถานะการเผยแพร่ได้");

        return { "message" : "เปลี่ยนสถานะสำเร็จ" };
    })

    // DELETE /posts/:id - ลบโพสต์
    .delete("/:id", async ({ params }) => {
        const post = await prisma.posts.findFirst({
            where : { id : Number(params.id) }
        })

        if(!post) throw new Error("ไม่เจอข้อมูล");

        const deletePost = await prisma.posts.delete({
            where : { id : Number(params.id) }
        })

        if(!deletePost) throw new Error("ไม่สามารถลบข้อมูลได้");

        return { "message" : "ลบข้อมูลสำเร็จ" };
    })

    // GET /posts/:id - ดึงข้อมูลโพสต์ตาม ID
    .get("/:id", async ({ params }) => {
        const post = await prisma.posts.findFirst({
            where : { id : Number(params.id) },
            include: {
                content: true,
                protection: true,
                situation: true,
                symptom: true,
            }
        })

        if(!post) throw new Error("ไม่เจอข้อมูล");

        return { "resultData" : post };
    })

    // PUT /posts/:id - แก้ไขข้อมูลโพสต์
    .put("/:id", async ({ body, params }) => {
        const post = await prisma.posts.findFirst({
            where : { id : Number(params.id) }
        })

        if(!post) throw new Error("ไม่เจอข้อมูล");

        const updateContent = await prisma.content.update({
            where: { id: post.content_id },
            data: { detail: body.content }
        })

        const updateProtection = await prisma.protection.update({
            where: { id: post.protection_id },
            data: { detail: body.protection }
        })

        const updateSituation = await prisma.situation.update({
            where: { id: post.situation_id },
            data: { detail: body.situation }
        })

        const updateSymptom = await prisma.symptom.update({
            where: { id: post.symptom_id },
            data: { detail: body.symptom }
        })

        const updatePost = await prisma.posts.update({
            where : { id : Number(params.id) },
            data : {
                title : body.title,
                category_id : Number(body.category_id),
                cover_image_url : body.cover_image_url,
                video_link : body.video_link,
                isActive : body.isActive,
                updated_at : new Date(),
                user_update_id : Number(body.user_update_id)
            }
        })

        if(!updatePost) throw new Error("ไม่สามารถแก้ไขข้อมูลได้");

        return { "message" : "แก้ไขข้อมูลสำเร็จ" };
    })

    // GET /posts/user/:id - ดูโพสต์เฉพาะ ID และเพิ่มยอด View
    .get("/user/:id", async ({ params }) => {
        const post = await prisma.posts.findFirst({
            where : { id : Number(params.id) },
            include : {
                category : true,
                content : true,
                protection: true,
                situation: true,
                symptom: true,
                users_posts_user_idTousers : true,
                users_posts_user_update_idTousers : true
            }
        })

        if(!post) throw new Error("ไม่เจอข้อมูล");

        // อัปเดตยอดผู้ชม
        const updateView = await prisma.posts.update({
            where : { id : Number(params.id) },
            data : { views : post.views + 1 }
        })

        return { "resultData" : post };
    })
