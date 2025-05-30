
import { NextRequest, NextResponse } from "next/server";
import { Player, Team, SportType } from "@/entities";
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

export type PlayerParams = {
    params: Promise<{ id: string }>;
  };

export async function createPlayer(req: NextRequest, { params }:PlayerParams) {
    try {
        const { id: team_id } =await params;
        console.log("team_id:", team_id);

        const formData = await req.formData();
        const name = formData.get("name") as string;
        const position = formData.get("position") as string;
        const contact_info = formData.get("contact_info") as string;
        const sportType_id = formData.get("sport_id") as string;
        const imageFile = formData.get("image") as File;

        if (!name || !position || !contact_info) {
            return NextResponse.json(
                { error: "Name, position, and contact_info are required" },
                { status: 400 }
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

        await initializeDataSource();

      
        
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
        const tempFilePath = `${os.tmpdir()}/${imageFile.name}-${Date.now()}`;
        const fileBuffer = Buffer.from(await imageFile.arrayBuffer());
        await writeFile(tempFilePath, fileBuffer);

        const uploadResult = await cloudinary.uploader.upload(tempFilePath, {
            folder: "players",
            public_id: `${name}-${Date.now()}`,
        });

        await fs.unlink(tempFilePath);

        const playerRepository = AppDataSource.getRepository(Player);
        const player = playerRepository.create({
            name,
            position,
            contact_info,
            team,
            sport,
            image: uploadResult.secure_url,
        });
        await playerRepository.save(player);

        return NextResponse.json(
            { message: "Player created successfully", data: player },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating player:", error);
        return NextResponse.json(
            { error: "Error creating player" },
            { status: 500 }
        );
    }
}

export const getPlayerBySport = async (_req:NextRequest,{ params }:PlayerParams) => {
    try {

        console.log("paramss", params)
        const { id: sport_id } = await params;
        await initializeDataSource();

        const playerRepository = AppDataSource.getRepository(Player);
        const players = await playerRepository.find({
            where: { sport_id },
            relations: ["team", "sport"],
        })


        console.log(players)
        return NextResponse.json(
            { data: players },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error getting players by sport:", error);
        return NextResponse.json(
            { error: "Error getting players by sport" },
            { status: 500 }
        );

    };
};

export const getPlayerById = async (_req: NextRequest, { params }:PlayerParams) => {
    try {
        await initializeDataSource();
        const playerRepository = AppDataSource.getRepository(Player);
        const player = await playerRepository.findOne({
            where: { id: (await params).id },
            relations: ["team"],
        });
        if (!player) {
            return NextResponse.json(
                { error: "Player not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { data: player },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error getting player by ID:", error);
        return NextResponse.json(
            { error: "Error getting player" },
            { status: 500 }
        );
    }
};
export const getPlayersByteams = async (_req: NextRequest, { params }: PlayerParams) => {
    try {
        const { id: team_id } = await params;
        await initializeDataSource();
        const playerRepository = AppDataSource.getRepository(Player);
        const players = await playerRepository.find({
            where: { team_id: team_id },
            relations: ["team"],
        });
        return NextResponse.json(
            { data: players },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error getting players:", error);
        return NextResponse.json(
            { error: "Error getting players" },
            { status: 500 }
        );
    }
};


export const getPlayers = async (_req: NextRequest) => {
    try {
        await initializeDataSource();
        const playerRepository = AppDataSource.getRepository(Player);
        const players = await playerRepository.find({ relations: ["team"] });
        return NextResponse.json(
            { data: players },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error getting players:", error);
        return NextResponse.json(
            { error: "Error getting players" },
            { status: 500 }
        );
    }
};

export const deletePlayerById = async (_req: NextRequest, { params }:PlayerParams) => {
    try {
        const { id } =await params;
        await initializeDataSource();
        const playerRepository = AppDataSource.getRepository(Player);
        await playerRepository.delete(id);
        return NextResponse.json(
            { message: "Player deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting player:", error);
        return NextResponse.json(
            { error: "Error deleting player" },
            { status: 500 }
        );
    }

}

export const updatePlayerById = async (req: NextRequest, { params }:PlayerParams) => {
    try {
        const { id } =await params;
        await initializeDataSource();
        const playerRepository = AppDataSource.getRepository(Player);
        const player = await playerRepository.findOneBy({id});
        if (!player) {
            return NextResponse.json(
                { error: "Player not found" },
                { status: 404 }
            );
        }
        const formData = await req.formData();
        const name = formData.get("name") as string;
        const position = formData.get("position") as string;
        const contact_info = formData.get("contact_info") as string;
        const imageFile = formData.get("image") as File;

        if (name) player.name = name;
        if (position) player.position = position;
        if (contact_info) player.contact_info = contact_info;

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
                folder: "players",
                public_id: `${name}-${Date.now()}`,
            });

            await fs.unlink(tempFilePath);

            player.image = uploadResult.secure_url;
        }

        await playerRepository.save(player);

        return NextResponse.json(
            { message: "Player updated successfully", data: player },
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