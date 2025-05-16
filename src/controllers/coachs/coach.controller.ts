import { NextRequest, NextResponse } from "next/server";
import { Coach, SportType, Team } from "@/entities";

import { initializeDataSource } from "@/utils/inititializeDataSource";
import { AppDataSource } from "@/config";
import fs, { writeFile } from "fs/promises";
import cloudinary from "@/lib/cloudinary";
import os from "os";

interface CoachInput {
    name: string,
    contact_info: string,
    image: string,
    team_id: string,
    sport_id: string
}
export const config = {
    api: {
        bodyParser: false,
    },
};
export const createCoach = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const { id: team_id } = params;
        // await initializeDataSource();


        (async () => {
            await initializeDataSource();
            console.log("App is running...");
        })();
        // const { name, contact_info, image } = await req.json() as CoachInput;

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

export const getCoaches = async (req: NextRequest) => {
    try {
        await initializeDataSource();
        const coachRepository = AppDataSource.getRepository(Coach);
        const coaches = await coachRepository.find();
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

export const getCoachesByteam = async (rep: NextRequest, { params }: { params: { id: string } }) => {
    {
        try {
            await initializeDataSource();
            const { id: team_id } = params;
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


export const getCoachesBysport = async ({ params }: { params: { id: string } }) => {
    try {
        await initializeDataSource();
        const { id: sport_id } = params;
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


export const deleteCoachById = async ( { params }: { params: { id: string } }) => {

    try {
        await initializeDataSource();
        const { id } = params;
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


export const updateCoachById = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const { id } = params;
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

        // Update the basic fields
        if (name) coach.name = name;
        if (contact_info) coach.contact_info = contact_info;

        // If an image is included, upload it to Cloudinary
        if (imageFile) {
            if (!imageFile.type.startsWith("image/")) {
                return NextResponse.json(
                    { error: "Only image files are allowed" },
                    { status: 400 }
                );
            }

            // Save the image temporarily
            const tempFilePath = `${os.tmpdir()}/${imageFile.name}-${Date.now()}`;
            const fileBuffer = Buffer.from(await imageFile.arrayBuffer());
            await writeFile(tempFilePath, fileBuffer);

            // Upload to Cloudinary
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