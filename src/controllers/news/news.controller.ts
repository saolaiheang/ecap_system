import { NextRequest, NextResponse } from "next/server";
import { News, SportType } from "@/entities";
import { AppDataSource } from "@/config";
import { initializeDataSource } from "@/utils/inititializeDataSource";
import cloudinary from "@/lib/cloudinary";
import os from "os";
import fs, { writeFile } from "fs/promises";


export const config = {
    api: {
        bodyParser: false,
    },
};

export const createNews = async (req: NextRequest) => {
    try {
        
            await initializeDataSource();
        // const { title, description, image, sport_type_id } = await req.json() as NewsInput;

         const formData= await req.formData();
         const title = formData.get("title") as string;
         const description = formData.get("description") as string;
         const image = formData.get("image") as File;
         const sport_type_id = formData.get("sport_type_id") as string;
        // Validate required fields
        if (!title || !description || !sport_type_id) {
            return NextResponse.json(
                { error: "Title, description, and sport_type_id are required" },
                { status: 400 }
            );
        }

        if (!image) {
            return NextResponse.json(
                { error: "Image file is required" },
                { status: 400 }
            );
        }

        if (!image.type.startsWith("image/")) {
            return NextResponse.json(
                { error: "Only image files are allowed" },
                { status: 400 }
            );
        }

        const tempFilePath = `${os.tmpdir()}/${image.name}-${Date.now()}`;
                const fileBuffer = Buffer.from(await image.arrayBuffer());
                await writeFile(tempFilePath, fileBuffer);
        
                const uploadResult = await cloudinary.uploader.upload(tempFilePath, {
                    folder: "players",
                    public_id: `${title}-${Date.now()}`,
                });
        
                await fs.unlink(tempFilePath);

        const sportTypeRepository = AppDataSource.getRepository(SportType);
        const sportType = await sportTypeRepository.findOne({ where: { id:sport_type_id } });
        if (!sportType) {
            return NextResponse.json(
                { error: "Sport type not found" },
                { status: 404 }
            );
        }

        const newsRepository = AppDataSource.getRepository(News);
        const news = newsRepository.create({
            title,
            description,
            image:uploadResult.secure_url, 
            sport_type_id,
            date: new Date(), 
        });
        await newsRepository.save(news);

        return NextResponse.json(
            { message: "News created successfully", data: news },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating news:", error);
        return NextResponse.json(
            { error: "Error creating news" },
            { status: 500 }
        );
    }
};

export const getNews = async (_req: NextRequest) => {
    try {
        await initializeDataSource();
        const newsRepository = AppDataSource.getRepository(News);
        const news = await newsRepository.find({ relations: ["sportType"] });
        return NextResponse.json(
            { data: news },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error getting news:", error);
        return NextResponse.json(
            { error: "Error getting news" },
            { status: 500 }
        );
    }
};

export const getNewsByIdTypeOfSport = async (
    _req: NextRequest,
    context: { params: { id: string } }
) => {
    try {
        await initializeDataSource();
        const { id } = context.params;
        const newsRepository = AppDataSource.getRepository(News);
        const news = await newsRepository.find({
            where: { sport_type_id: id },
            relations: ["sportType"],
        });
        return NextResponse.json(
            { data: news },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error getting news by sport type:", error);
        return NextResponse.json(
            { error: "Error getting news" },
            { status: 500 }
        );
    }
};

export const deleteNews = async (
    _req: NextRequest,
    context: { params: { id: string } }
) => {
    try {
        await initializeDataSource();
        const { id } = context.params;
        const newsRepository = AppDataSource.getRepository(News);
        const news = await newsRepository.findOne({ where: { id } });
        if (!news) {
            return NextResponse.json(
                { error: "News not found" },
                { status: 404 }
            );
        }

        await newsRepository.remove(news);
        return NextResponse.json(
            { message: "News deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting news:", error);
        return NextResponse.json(
            { error: "Error deleting news" },
            { status: 500 }
        );
    }
};



export const updateNews = async (
    req: NextRequest,
    context: { params: { id: string } }
) => {
    try {
        await initializeDataSource();
        const { id } = context.params;

        const formData = await req.formData();
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const image = formData.get("image") as File;
        const sport_type_id = formData.get("sport_type_id") as string;

        // Find the existing news
        const newsRepository = AppDataSource.getRepository(News);
        const news = await newsRepository.findOne({ where: { id } });

        if (!news) {
            return NextResponse.json(
                { error: "News not found" },
                { status: 404 }
            );
        }

        // Validate SportType if sport_type_id is provided
        if (sport_type_id) {
            const sportTypeRepository = AppDataSource.getRepository(SportType);
            const sportType = await sportTypeRepository.findOne({ where: { id: sport_type_id } });

            if (!sportType) {
                return NextResponse.json(
                    { error: "Sport type not found" },
                    { status: 404 }
                );
            }
        }

        // Update fields if they are provided
        news.title = title || news.title;
        news.description = description || news.description;
        news.sport_type_id = sport_type_id || news.sport_type_id;

        // Handle image upload if a new image is provided
        if (image) {
            if (!image.type.startsWith("image/")) {
                return NextResponse.json(
                    { error: "Only image files are allowed" },
                    { status: 400 }
                );
            }

            // Temporary file path and buffer creation
            const tempFilePath = `${os.tmpdir()}/${image.name}-${Date.now()}`;
            const fileBuffer = Buffer.from(await image.arrayBuffer());
            await writeFile(tempFilePath, fileBuffer);

            // Upload to Cloudinary
            const uploadResult = await cloudinary.uploader.upload(tempFilePath, {
                folder: "players",
                public_id: `${title}-${Date.now()}`,
            });

            // Delete the local temp file
            await fs.unlink(tempFilePath);

            // Update image URL
            news.image = uploadResult.secure_url;
        }

        // Update the modification date
        news.date = new Date();

        // Save the updated news
        await newsRepository.save(news);

        return NextResponse.json(
            { message: "News updated successfully", data: news },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating news:", error);
        return NextResponse.json(
            { error: "Error updating news" },
            { status: 500 }
        );
    }
};


export const getAllNewsBysport=async(_req:NextRequest,{params}:{params:{id:string}})=>{
    try{
        const {id}=params;
        await initializeDataSource();
        const newsRepository=AppDataSource.getRepository(News);
        const news=await newsRepository.find({where:{sport_type_id:id},relations:["sportType"]})

        if(!news){
            return NextResponse.json(
                {error:"News not found"},
                {status:404}
            )
        }
        return NextResponse.json({
            message:"News by sport successfully",data:news
        },{status:200})

    }catch(err){
        return NextResponse.json(
            {error:"Can't get all news by this sport",err:err},
            {status:500}
        )

    }
}


export const getNewsById= async (_req:NextRequest,{params}:{params:{id:string}})=>{
    try{
        const {id}=params;
        await initializeDataSource();
        const newsRepository=AppDataSource.getRepository(News);
        const news=await newsRepository.findOne({where:{id},relations:["sportType"]})
        if(!news){
            return NextResponse.json(
                {error:"News not found"},
                {status:404}
                )
                }
                return NextResponse.json({
                    message:"News by id successfully",data:news
                    },{status:200})
                    }catch(err){
                        return NextResponse.json(
                            {error:"Can't get news by this id",err:err},
                            {status:500}
                            )
                            }
}
