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
            { message: "Failed to create History", err: err },
            { status: 500 }

        )

    }
}

export const getAllHistory = async (_req: NextRequest) => {
    try {
        await initializeDataSource();
        const historyRepository = AppDataSource.getRepository(History);
        const histories = await historyRepository.find({ order: { createdAt: "DESC" } });
        return NextResponse.json(
            { message: "Histories fetched successfully", data: histories },
            { status: 200 }
        );
    } catch (err) {
        return NextResponse.json(
            { message: "Failed to fetch Histories", err: err },
            { status: 500 }
        )
    }
}

export const deleteHistory = async (_req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        await initializeDataSource();
        const { id } = params;
        const historyRepository = AppDataSource.getRepository(History);
        const history = await historyRepository.findOneBy({ id: id });
        if (!history) {
            return NextResponse.json(
                { message: "History not found", data: null },
                { status: 404 }
            );
        }
        await historyRepository.delete(id);
        return NextResponse.json(
            { message: "History deleted successfully" },
            { status: 200 }
        );
    } catch (err) {
        return NextResponse.json(
            { message: "Failed to delete History", err: err },
            { status: 500 }
        )
    }
}

export const updateHistory = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        await initializeDataSource();
        const { id } = params;
        const historyRepository = AppDataSource.getRepository(History);
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
        const history =await historyRepository.findOneBy({ id:id });
        if (!history) {
            return NextResponse.json(
                { error: "History not found" },
                { status: 404 }
            );
        }
        history.year = year;
        history.title = title;
        history.description = description;
        history.imageUrl = uploadResult.secure_url;

        await historyRepository.save(history);
        return NextResponse.json({ message: "History updated successfully" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to update history" });
    }


}