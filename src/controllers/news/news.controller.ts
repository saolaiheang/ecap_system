import { NextRequest, NextResponse } from "next/server";
import { News, SportType } from "@/entities";
import { AppDataSource } from "@/config";
import { initializeDataSource } from "@/utils/inititializeDataSource";

interface NewsInput {
    title: string;
    description: string;
    image?: string;
    sport_type_id: string;
}

export const createNews = async (req: NextRequest) => {
    try {
        // await initializeDataSource();
        (async () => {
            await initializeDataSource();
            console.log("App is running...");
        })();

        const { title, description, image, sport_type_id } = await req.json() as NewsInput;

        // Validate required fields
        if (!title || !description || !sport_type_id) {
            return NextResponse.json(
                { error: "Title, description, and sport_type_id are required" },
                { status: 400 }
            );
        }

        // Validate SportType exists
        const sportTypeRepository = AppDataSource.getRepository(SportType);
        const sportType = await sportTypeRepository.findOne({ where: { id: sport_type_id } });
        if (!sportType) {
            return NextResponse.json(
                { error: "Sport type not found" },
                { status: 404 }
            );
        }

        // Create and save News
        const newsRepository = AppDataSource.getRepository(News);
        const news = newsRepository.create({
            title,
            description,
            image: image, // Optional field
            sport_type_id,
            date: new Date(), // Set current date
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

export const getNews = async (req: NextRequest) => {
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
    req: NextRequest,
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
    req: NextRequest,
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
        const { title, description, image, sport_type_id } = await req.json() as NewsInput;

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

        news.title = title || news.title;
        news.description = description || news.description;
        news.image = image || news.image;
        news.sport_type_id = sport_type_id || news.sport_type_id;
        news.date = new Date(); // Update date on modification (optional)

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