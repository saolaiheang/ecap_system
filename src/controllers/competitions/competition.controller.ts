
import { NextRequest, NextResponse } from "next/server";
import { AppDataSource } from "@/config";
import { Competition, SportType } from "@/entities";
import { initializeDataSource } from "@/utils/inititializeDataSource";
import fs, { writeFile } from "fs/promises";
import cloudinary from "@/lib/cloudinary";
import os from "os";

export const config = {
    api: {
        bodyParser: false,
    },
};

export type SportParams = {
    params: Promise<{ id: string }>; 
  };
  export type CompetitionParams = {
    params: Promise<{ id: string; competition_id?: string }>;
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

export const getCompetitionByTypeOfSport = async (_req:NextRequest,{params}:SportParams) => {
    try {
        await initializeDataSource();

        const { id: sport_id } =await params;
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
export const getAllCompetitions = async (_req: NextRequest) => {
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


export const getCompetitionById = async (_rep:NextRequest,{params}:CompetitionParams) => {
    try {
        await initializeDataSource();

        const { id, competition_id } =await params;

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
export const updateCompetition = async (req: NextRequest, {params}:CompetitionParams) => {
    try {
        await initializeDataSource();

        const { id } = await params;
        
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
       
        const parsedStartDate = new Date(start_date);
        if (isNaN(parsedStartDate.getTime())) {
          return NextResponse.json(
            { error: "Invalid start date format" },
            { status: 400 }
          );
        }

        const competition = await competitionRepository.findOne({ where: { id } });
        if (!competition) {
            return NextResponse.json(
                { error: "Competition not found" },
                { status: 404 }
            );
        }
        competition.name = name;
        competition.location = location;
        competition.start_date =parsedStartDate;
        competition.sportType = sportType;
        competition.image = uploadResult.secure_url;

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

export const deleteCompetition = async (_req: NextRequest, {params}:CompetitionParams) => {
    try {
        await initializeDataSource();

        const { id } = await params;
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