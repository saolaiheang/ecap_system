
import { NextRequest, NextResponse } from "next/server";
import { AppDataSource } from "@/config";
import { Team, SportType } from "@/entities";
import { initializeDataSource } from "@/utils/inititializeDataSource";
import fs, { writeFile } from "fs/promises";
import cloudinary from "@/lib/cloudinary";
import os from "os";
export const config = {
    api: {
        bodyParser: false,
    },
};

export const createTeam = async (req: NextRequest) => {
    try {
        await initializeDataSource();

        const formData = await req.formData();
        const name = formData.get("name") as string;
        const division = formData.get("division") as string;
        const contact_info = formData.get("contact_info") as string;
        const sport_id = formData.get("sport_id") as string;
        const imageFile = formData.get("image") as File;
       
        if (!name || !division || !sport_id) {
            return NextResponse.json(
                { error: "Name, division, and sport_id are required" },
                { status: 400 }
            );
        }

        const teamRepository = AppDataSource.getRepository(Team);
        const typeOfSportRepository = AppDataSource.getRepository(SportType);
        const sportType = await typeOfSportRepository.findOne({ where: { id: sport_id } });
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
                    folder: "teams",
                    public_id: `${name}-${Date.now()}`,
                });
        
                await fs.unlink(tempFilePath);
        const team = teamRepository.create({
            name,
            division,
            contact_info,
            sportType,
            image: uploadResult.secure_url,
           
        });

        await teamRepository.save(team);
        const savedTeam = await teamRepository.findOne({
            where: { id: team.id },
            relations: ["sportType"],
        });
        if (!savedTeam) {
            return NextResponse.json(
                { error: "Team not saved correctly" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "Team created successfully", data: savedTeam },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating team:", error);
        return NextResponse.json(
            { error: "Error creating team" },
            { status: 500 }
        );
    }
};

export const getTeamsByTypeOf= async (req: NextRequest, context: { params: { id: string } }) => {
    try {
        await initializeDataSource();
        const { id } = context.params;
        const teamRepository = AppDataSource.getRepository(Team);
        const teams = await teamRepository.find({
            where: { sportType: { id } },
            relations: ["sportType"],
        });
        return NextResponse.json(
            { data: teams },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error getting teams by type of sport:", error);
        return NextResponse.json(
            { error: "Error getting teams" },
            { status: 500 }
        );
    }
};

export const getTeams = async (_req: NextRequest) => {
    try {
        await initializeDataSource();
        const teamRepository = AppDataSource.getRepository(Team);
        const teams = await teamRepository.find({
            relations: ["sportType"],
        });
        return NextResponse.json(
            { data: teams },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error getting teams:", error);
        return NextResponse.json(
            { error: "Error getting teams" },
            { status: 500 }
        );
    }
};

export const updateTeam= async (req: NextRequest, {params}: { params: { id: string } }) => {
    try {
        await initializeDataSource();
        const { id } =params;
        const formData = await req.formData();
        const name = formData.get("name") as string;
        const division = formData.get("division") as string;
        const contact_info = formData.get("contact_info") as string;
        const imageFile = formData.get("image") as File;
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
                    folder: "teams",
                    public_id: `${name}-${Date.now()}`,
                });
        
                await fs.unlink(tempFilePath);
        const teamRepository = AppDataSource.getRepository(Team);
        const team = await teamRepository.findOne({ where: { id } });
        if (!team) {
            return NextResponse.json(
                { error: "Team not found" },
                { status: 404 }
            );
        }
        if (name) {
            team.name = name;
        }
        if (division) {
            team.division = division;
        }
        if (contact_info) {
            team.contact_info = contact_info;
        }
        if(imageFile){
            team.image = uploadResult.secure_url;
        }
        await teamRepository.save(team);
        return NextResponse.json(
            { message: "Team updated successfully", data: team },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating team:", error);
        return NextResponse.json(
            { error: "Error updating team" },
            { status: 500 }
        );
    }
};

export const deleteTeam=async (req:NextRequest,{params}:{params:{id:string}})=>{
    try {
        await initializeDataSource();
        const teamRepository = AppDataSource.getRepository(Team);
        const team = await teamRepository.findOne({ where: { id: params.id } });
        if (!team) {
            return NextResponse.json(
                { error: "Team not found" },
                { status: 404 }
                );
                }
                await teamRepository.delete(params.id);
                return NextResponse.json(
                    { message: "Team deleted successfully" },
                    { status: 200 }
                    );
                    } catch (error) {
                        console.error("Error deleting team:", error);
                        return NextResponse.json(
                            { error: "Error deleting team" },
                            { status: 500 }
                            );
                            }
}