import { NextRequest, NextResponse } from "next/server";
import { History } from "@/entities";
import { initializeDataSource } from "@/utils/inititializeDataSource";
import { AppDataSource } from "@/config";
import cloudinary from "@/lib/cloudinary";
import os from 'os';
import fs, { writeFile } from "fs/promises"
export const createHistory = async (req: NextRequest) => {
    try {
        await initializeDataSource();
        const formData = await req.formData()
        const year = formData.get("year") as string;
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const imageUrl = formData.get("imageUrl") as File;

        if (!year || !description || !title) {
            return NextResponse.json(
                { error: "year title and description are required" },
                { status: 400 }
            );
        }
        if (!imageUrl) {
            return NextResponse.json(
                { error: "Image file is required" },
                { status: 400 }
            )
        }
        if (!imageUrl.type.startsWith("image/")) {
            return NextResponse.json(
                { error: "Only image file are allowed" },
                { status: 400 }
            )
        }

        const tempFilePath = `${os.tmpdir()}/${imageUrl.name}-${Date.now()}`;
        const fileBuffer = Buffer.from(await imageUrl.arrayBuffer());
        await writeFile(tempFilePath, fileBuffer);
        const uploadResult = await cloudinary.uploader.upload(tempFilePath, {
            folder: "history",
            public_id: `${title}-${Date.now()}`
        })
        await fs.unlink(tempFilePath);
        const historyRepository = AppDataSource.getRepository(History);
        const history = historyRepository.create({
            year,
            title,
            description,
            imageUrl: uploadResult.secure_url
        });
        await historyRepository.save(history);
        return NextResponse.json(
            { message: "History created successfully", data: history },
            { status: 201 }
        );
    } catch (err) {
        return NextResponse.json(
            {message:"Failed to create History",err:err},
            {status:500}

        )

    }
}