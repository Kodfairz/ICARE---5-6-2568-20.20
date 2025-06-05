import { Elysia } from 'elysia';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt'; // ใช้สำหรับเข้ารหัสรหัสผ่าน
import jwt from 'jsonwebtoken'; // ใช้สำหรับสร้าง JWT token

const prisma = new PrismaClient();

// สร้าง routes สำหรับจัดการข้อมูลผู้ใช้ โดยใช้ prefix /users
export const userRoutes = new Elysia({ prefix: "/users" })

    // ดึงผู้ใช้ทั้งหมด
    .get('/', async () => {
        return await prisma.users.findMany();
    })

    // สมัครผู้ใช้ใหม่
    .post('/', async ({ body }) => {
        // ตรวจสอบว่ามี username นี้ในระบบหรือยัง
        const user = await prisma.users.findFirst({
            where: {
                username: body.username
            }
        });

        // ถ้ามีแล้วให้แจ้งว่าไม่สามารถสมัครซ้ำได้
        if (user) {
            throw new Error("มีผู้ใช้งานนี้แล้ว");
        }

        // เข้ารหัสรหัสผ่านก่อนบันทึก
        const password = bcrypt.hashSync(body.password, 10);

        // สร้างผู้ใช้ใหม่
        return await prisma.users.create({
            data: {
                username: body.username,
                password: password,
                role: body.role
            }
        });
    })

    // ล็อกอินผู้ใช้
    .post("/login", async ({ body }) => {
        // ตรวจสอบว่ามีผู้ใช้นี้หรือไม่
        const user = await prisma.users.findFirst({
            where: {
                username: body.username
            }
        });

        if (!user) {
            throw new Error("ไม่พบผู้ใช้งาน");
        }

        // ตรวจสอบว่าผู้ใช้ถูกเปิดใช้งานอยู่หรือไม่
        if (!user.isActive) {
            throw new Error("ผู้ใช้ปิดใช้งาน");
        }

        // ตรวจสอบความถูกต้องของรหัสผ่าน
        const isPasswordMatch = bcrypt.compareSync(body.password, user.password);

        if (!isPasswordMatch) {
            throw new Error("รหัสผ่านไม่ถูกต้อง");
        }

        // สร้าง JWT token เพื่อส่งกลับไปให้ client
        const token = jwt.sign({
            data: {
                "username": user.username,
                "role": user.role,
                "id": user.id,
                "isActive": user.isActive
            }
        }, 'secret', { expiresIn: '24h' }); // หมายเหตุ: ควรใช้ secret จาก .env

        // ส่ง token และข้อมูลผู้ใช้กลับ
        return {
            "token": token,
            "resultData": {
                "username": user.username,
                "role": user.role,
                "id": user.id,
                "isActive": user.isActive
            }
        };
    })

    // แก้ไขชื่อผู้ใช้งาน
    .put("/:id", async ({ body, params }) => {
        // ตรวจสอบว่าผู้ใช้มีอยู่จริงหรือไม่
        const user = await prisma.users.findFirst({
            where: {
                id: Number(params.id)
            }
        });

        if (!user) {
            throw new Error("ไม่พบผู้ใช้งาน");
        }

        // อัปเดตชื่อผู้ใช้
        const updateUser = await prisma.users.update({
            where: {
                id: Number(params.id)
            },
            data: {
                username: body.username
            }
        });

        if (!updateUser) {
            throw new Error("ไม่สามารถแก้ไขข้อมูลได้");
        }

        return {
            "message": "แก้ไขข้อมูลสำเร็จ"
        };
    })

    // เปลี่ยนรหัสผ่านผู้ใช้
    .put("/change-password/:id", async ({ body, params }) => {
        // ค้นหาผู้ใช้ตาม id
        const user = await prisma.users.findFirst({
            where: {
                id: Number(params.id)
            }
        });

        // ตรวจสอบรหัสผ่านเดิมว่าตรงหรือไม่
        const isPasswordMatch = bcrypt.compareSync(body.oldPassword, user.password);

        if (!isPasswordMatch) {
            throw new Error("รหัสผ่านเดิมไม่ถูกต้อง");
        }

        // เข้ารหัสรหัสผ่านใหม่
        const newPassword = bcrypt.hashSync(body.newPassword, 10);

        // อัปเดตรหัสผ่านใหม่
        const updateUser = await prisma.users.update({
            where: {
                id: Number(params.id)
            },
            data: {
                password: newPassword
            }
        });

        if (!updateUser) {
            throw new Error("ไม่สามารถเปลี่ยนรหัสผ่านได้");
        }

        return {
            "message": "เปลี่ยนรหัสผ่านสำเร็จ"
        };
    })

    // เปลี่ยนสถานะการใช้งาน (active/inactive)
    .patch("/status/:id", async ({ params }) => {
        const user = await prisma.users.findFirst({
            where: {
                id: Number(params.id)
            }
        });

        if (!user) {
            throw new Error("ไม่พบผู้ใช้งาน");
        }

        // toggle ค่าสถานะ
        const updateUser = await prisma.users.update({
            where: {
                id: Number(params.id)
            },
            data: {
                isActive: !user.isActive
            }
        });

        if (!updateUser) {
            throw new Error("ไม่สามารถเปลี่ยนสถานะได้");
        }

        return {
            "message": "เปลี่ยนสถานะสำเร็จ"
        };
    })

    // ลบผู้ใช้งาน
    .delete("/:id", async ({ params }) => {
        const user = await prisma.users.findFirst({
            where: {
                id: Number(params.id)
            }
        });

        if (!user) {
            throw new Error("ไม่พบผู้ใช้งาน");
        }

        const deleteUser = await prisma.users.delete({
            where: {
                id: Number(params.id)
            }
        });

        if (!deleteUser) {
            throw new Error("ไม่สามารถลบข้อมูลได้");
        }

        return {
            "message": "ลบข้อมูลสำเร็จ"
        };
    })

    // ดึงข้อมูลผู้ใช้รายบุคคล
    .get("/:id", async ({ params }) => {
        const user = await prisma.users.findFirst({
            where: {
                id: Number(params.id)
            }
        });

        if (!user) {
            throw new Error("ไม่พบผู้ใช้งาน");
        }

        return {
            "resultData": user
        };
    });
