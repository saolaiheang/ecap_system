import { NextRequest, NextResponse } from "next/server";
import { Player } from "@/entities";
import { initializeDataSource } from "@/utils/inititializeDataSource";
import { AppDataSource } from "@/config";
import { Team } from "@/entities";
import { SportType } from "@/entities";



interface PlayerInput {
    name: string;
    position: string;
    contact_info: string;
    team_id?: string;
    image:string
    sport_id:string;
}
const validPositions = ["Goalkeeper", "Defender", "Midfielder", "Forward"];
export const createPlayer = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const { id: team_id } = params;
       
        console.log("team_id", team_id);
        await initializeDataSource();
        const { name, position, contact_info,image,sport_id } = await req.json() as PlayerInput;

        if (!name || !position || !contact_info  ) {
            return NextResponse.json(
                { error: "Name and position are required" },
                { status: 400 }
            );
        }

        if (!validPositions.includes(position)) {
            return NextResponse.json(
                { status: "error", message: `Position must be one of: ${validPositions.join(", ")}` },
                { status: 400 }
            );
        }
        const teamRepository = AppDataSource.getRepository(Team);
        const team = await teamRepository.findOne({ where: { id: team_id } });

        const typeSportRepository= AppDataSource.getRepository(SportType);
        const sport = await typeSportRepository.findOne({ where: { id: sport_id } });


        if (!team) {
            return NextResponse.json(
                { error: "Team not found" },
                { status: 404 }
            );
        }
        const playerRepository = AppDataSource.getRepository(Player);
        const player = playerRepository.create({ name, position, contact_info, team ,image,sport_id});
        await playerRepository.save(player);
        return NextResponse.json(
            { message: "player created successfully", data: player },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating player:", error);
        return NextResponse.json(
            { error: "Error creating player" },
            { status: 500 }
        );
    }
};


export const getPlayersByteams = async (req: NextRequest,{params}:{params:{id:string}}) => {
    try {
        const { id: team_id } = params;
        await initializeDataSource();
        const playerRepository = AppDataSource.getRepository(Player);
        const players = await playerRepository.find({where:{team_id:team_id},
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


export const getPlayers = async (req: NextRequest) => {
    try {
        await initializeDataSource();
        const playerRepository = AppDataSource.getRepository(Player);
        const players = await playerRepository.find({relations: ["team"]});
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