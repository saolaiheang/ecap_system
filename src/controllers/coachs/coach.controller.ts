import { NextRequest, NextResponse } from "next/server";
import { Coach, SportType, Team } from "@/entities";

import { initializeDataSource } from "@/utils/inititializeDataSource";
import { AppDataSource } from "@/config";
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
  export type TeamParams = {
    params: Promise<{ id: string }>; 
  };
  export type CoachParams = {
    params: Promise<{ id: string }>; 
  };
export const createCoach = async (req: NextRequest,{params}: TeamParams) => {
    try {
        const { id: team_id } = await params;
        await initializeDataSource();


        const formData = await req.formData();
        const name = formData.get("name") as string;
        const contact_info = formData.get("contact_info") as string;
        const sportType_id = formData.get("sport_id") as string;
        const imageFile = formData.get("image") as File;
        if (!name || !imageFile) {
            return NextResponse.json(
                {
                    message: "Please fill all the fields"
                },
                {
                    status: 400
                }
            )
        }
        const teamRepository = AppDataSource.getRepository(Team);
        const team = await teamRepository.findOne({ where: { id: team_id } });



        if (!team) {
            return NextResponse.json(
                { error: "Team not found" },
                { status: 404 }
            );
        }

        const sportTypeRepository = AppDataSource.getRepository(SportType);
        const sport = await sportTypeRepository.findOne({ where: { id: sportType_id } })
        if (!sport) {
            return NextResponse.json(
                { error: "sport not found" },
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
        const coachRepository = AppDataSource.getRepository(Coach);
        const coach = coachRepository.create({
            name,
            contact_info,
            image: uploadResult.secure_url,
            sport,
            team
        });
        await coachRepository.save(coach);
        return NextResponse.json(
            {
                message: "Coach created successfully",
                coach,
            },
            {
                status: 201,
            }
        );

    } catch (error) {
        console.error("Error creating coach:", error);
        return NextResponse.json(
            { error: "Error creating coach" },
            { status: 500 }
        );
    }


}

export const getCoaches = async (_: NextRequest) => {
    try {
        await initializeDataSource();
        const coachRepository = AppDataSource.getRepository(Coach);
        const coaches = await coachRepository.find({relations:["team","sport"]});
        return NextResponse.json(
            {
                coaches
            }
        )
    } catch (error) {
        console.error("Error getting coaches:", error);
        return NextResponse.json(
            { error: "Error getting coaches" },
            { status: 500 }
        );
    }

}

export const getCoachesByteam = async (_rep: NextRequest, { params }: TeamParams) => {
    {
        try {
            await initializeDataSource();
            const { id: team_id } =await params;
            const coachRepository = AppDataSource.getRepository(Coach);
            const coaches = await coachRepository.find({ where: { team: { id: team_id } } });
            return NextResponse.json(
                {
                    coaches
                }
            )
        } catch (error) {
            console.error("Error getting coaches:", error);
            return NextResponse.json(
                { error: "Error getting coaches" },
                { status: 500 }
            );
        }
    }
}


export const getCoachesBysport = async (req: NextRequest, { params }: SportParams) => {
    try {
        await initializeDataSource();
        const { id: sport_id } =await params;
        const coachRepository = AppDataSource.getRepository(Coach);
        const coaches = await coachRepository.find({ where: { sport: { id: sport_id } }, relations: ["team", "sport"] });
        return NextResponse.json(
            {
                coaches
            }
        )
    } catch (error) {
        console.error("Error getting coaches:", error);
        return NextResponse.json(
            { error: "Error getting coaches" },
            { status: 500 }
        );
    }
}


export const deleteCoachById = async (_req:NextRequest, { params }: CoachParams) => {

    try {
        await initializeDataSource();
        const { id } = await params;
        const coachRepository = AppDataSource.getRepository(Coach);
        await coachRepository.delete(id);
        return NextResponse.json(
            { message: "Coach deleted" }
        )
    } catch (error) {
        console.error("Error deleting coach:", error);
        return NextResponse.json(
            { error: "Error deleting coach" },
            { status: 500 }
        );
    }
}


export const updateCoachById = async (req: NextRequest, { params }: CoachParams) => {
    try {
        const { id } =await params;
        await initializeDataSource();
        const coachRepository = AppDataSource.getRepository(Coach);
        const coach = await coachRepository.findOneBy({id});
        if (!coach) {
            return NextResponse.json(
                { error: "coach not found" },
                { status: 404 }
            );
        }
        const formData = await req.formData();
        const name = formData.get("name") as string;
        const contact_info = formData.get("contact_info") as string;
        const imageFile = formData.get("image") as File;

        if (name) coach.name = name;
        if (contact_info) coach.contact_info = contact_info;

        if (imageFile) {
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
                folder: "coachs",
                public_id: `${name}-${Date.now()}`,
            });

            // Delete the temporary file after upload
            await fs.unlink(tempFilePath);

            // Update the image URL in the database
            coach.image = uploadResult.secure_url;
        }

        // Save the updated player to the database
        await coachRepository.save(coach);

        return NextResponse.json(
            { message: "Player updated successfully", data: coach },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating player:", error);
        return NextResponse.json(
            { error: "Error updating player" },
            { status: 500 }
        );
    }

}