
import { NextRequest, NextResponse } from "next/server";
import { AppDataSource } from "@/config";
import { Competition, SportType } from "@/entities";
import { initializeDataSource } from "@/utils/inititializeDataSource";
import fs, { writeFile } from "fs/promises";
import cloudinary from "@/lib/cloudinary";
import os from "os";
interface CompetitionInput {
    name: string;
    location: string;
    start_date: Date;
    sport_type_id: string;
    image: string;
}
export const config = {
    api: {
        bodyParser: false,
    },
};
export const createCompetition = async (req: NextRequest) => {
    try {
        await initializeDataSource();

        const formData = await req.formData();
        const name = formData.get("name") as string;
        const location = formData.get("location") as string;
        const sport_type_id = formData.get("sport_type_id") as string;
        const start_date = formData.get("start_date") as string;
        const imageFile = formData.get("image") as File;

        if (!name || !location || !start_date || !sport_type_id || !imageFile) {
            return NextResponse.json(
                { error: "Name, location, start_date, and sport_type_id are required" },
                { status: 400 }
            );
        }

        const sportTypeRepository = AppDataSource.getRepository(SportType);
        const sportType = await sportTypeRepository.findOne({ where: { id: sport_type_id } });
        if (!sportType) {
            return NextResponse.json(
                { error: "Sport type not found" },
                { status: 404 }
            );
        }

        if (!imageFile) {
            return NextResponse.json(
                { error: "Image file is required" },
                { status: 400 }
            );
        }

        if (!imageFile.type.startsWith("image/")) {
            return NextResponse.json(
                { error: "Only image files are allowed" },
                { status: 400 }
            );
        }

        const tempFilePath = `${os.tmpdir()}/${imageFile.name}-${Date.now()}`;
        const fileBuffer = Buffer.from(await imageFile.arrayBuffer());
        await writeFile(tempFilePath, fileBuffer);

        const uploadResult = await cloudinary.uploader.upload(tempFilePath, {
            folder: "players",
            public_id: `${name}-${Date.now()}`,
        });

        await fs.unlink(tempFilePath);

        const competitionRepository = AppDataSource.getRepository(Competition);
        const competition = competitionRepository.create({
            name,
            location,
            start_date,
            sport_type_id,
            image: uploadResult.secure_url
        });

        await competitionRepository.save(competition);

        return NextResponse.json(
            { message: "Competition created successfully", data: competition },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating competition:", error);
        return NextResponse.json(
            { error: "Error creating competition" },
            { status: 500 }
        );
    }
};

export const getCompetitionByTypeOfSport = async (params: { id: string }) => {
    try {
        await initializeDataSource();

        const { id: sport_id } = params;
        const competitionRepository = AppDataSource.getRepository(Competition);

        const competitions = await competitionRepository.find({
            where: { sport_type_id: sport_id },
            relations: ["sportType"],
        });
        if (competitions.length === 0) {
            return NextResponse.json(
                { message: "No competitions found for this sport type" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { data: competitions },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error getting competitions by sport type:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
};
export const getAllCompetitions = async (req: NextRequest) => {
    try {
        await initializeDataSource();
        const competitionRepository = AppDataSource.getRepository(Competition);
        const competitions = await competitionRepository.find({
            relations: ["sportType"],
        });
        if (competitions.length === 0) {
            return NextResponse.json(
                { message: "No competitions found" },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { data: competitions },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error getting all competitions:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }

}


export const getCompetitionById = async (params: { id: string, competition_id: string }) => {
    try {
        await initializeDataSource();

        const { id, competition_id } = params;

        console.log("Sport Type ID:", id);
        console.log("Competition ID:", competition_id);

        const competitionRepository = AppDataSource.getRepository(Competition);

        const competition = await competitionRepository.findOne({
            where: {
                id: competition_id,
                sport_type_id: id,
            },
            relations: ["sportType"],
        });

        if (!competition) {
            return NextResponse.json(
                { message: "Competition not found for this sport type" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { data: competition },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error getting competition by sport type and ID:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
};
export const updateCompetition = async (req: NextRequest, context: { params: { id: string } }) => {
    try {
        await initializeDataSource();

        const { id } = context.params;
        
        const formData = await req.formData();
        const name = formData.get("name") as string;
        const location = formData.get("location") as string;
        const sport_type_id = formData.get("sport_type_id") as string;
        const start_date = formData.get("start_date") as string;
        const imageFile = formData.get("image") as File;

        if (!name || !location || !start_date || !sport_type_id || !imageFile) {
            return NextResponse.json(
                { error: "Name, location, start_date, and sport_type_id are required" },
                { status: 400 }
            );
        }

        const sportTypeRepository = AppDataSource.getRepository(SportType);
        const sportType = await sportTypeRepository.findOne({ where: { id: sport_type_id } });
        if (!sportType) {
            return NextResponse.json(
                { error: "Sport type not found" },
                { status: 404 }
            );
        }

        if (!imageFile) {
            return NextResponse.json(
                { error: "Image file is required" },
                { status: 400 }
            );
        }

        if (!imageFile.type.startsWith("image/")) {
            return NextResponse.json(
                { error: "Only image files are allowed" },
                { status: 400 }
            );
        }

        const tempFilePath = `${os.tmpdir()}/${imageFile.name}-${Date.now()}`;
        const fileBuffer = Buffer.from(await imageFile.arrayBuffer());
        await writeFile(tempFilePath, fileBuffer);

        const uploadResult = await cloudinary.uploader.upload(tempFilePath, {
            folder: "players",
            public_id: `${name}-${Date.now()}`,
        });

        await fs.unlink(tempFilePath);

        const competitionRepository = AppDataSource.getRepository(Competition);
       


        const competition = await competitionRepository.findOne({ where: { id } });
        if (!competition) {
            return NextResponse.json(
                { error: "Competition not found" },
                { status: 404 }
            );
        }

        if (sport_type_id) {
            const sportType = await sportTypeRepository.findOne({ where: { id: sport_type_id } });
            if (!sportType) {
                return NextResponse.json(
                    { error: "Sport type not found" },
                    { status: 404 }
                );
            }
        }

       
        await competitionRepository.save(competition);

        return NextResponse.json(
            { message: "Competition updated successfully", data: competition },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating competition:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
};

export const deleteCompetition = async (req: NextRequest, context: { params: { id: string } }) => {
    try {
        await initializeDataSource();

        const { id } = context.params;
        const competitionRepository = AppDataSource.getRepository(Competition);

        const competition = await competitionRepository.findOne({ where: { id } });
        if (!competition) {
            return NextResponse.json(
                { error: "Competition not found" },
                { status: 404 }
            );
        }
        await competitionRepository.remove(competition);
        return NextResponse.json(
            { message: "Competition deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting competition:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
};