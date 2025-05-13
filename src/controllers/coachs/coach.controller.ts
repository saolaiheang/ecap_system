import { NextRequest, NextResponse } from "next/server";
import { Coach, Team } from "@/entities";

import { initializeDataSource } from "@/utils/inititializeDataSource";
import { AppDataSource } from "@/config";


interface CoachInput {
    name: string,
    contact_info: string,
    image: string,
    team_id: string
}

export const createCoach = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const { id: team_id } = params;
        await initializeDataSource();
        const { name, contact_info, image } = await req.json() as CoachInput;
        if (!name || !contact_info || !image) {
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
        const coachRepository = AppDataSource.getRepository(Coach);
        const coach = coachRepository.create({
            name,
            contact_info,
            image,
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

export const getCoachesByteam=async (rep:NextRequest,{params}:{params:{id:string}})=>{
    {
        try {
            await initializeDataSource();
            const {id:team_id}=params;
            const coachRepository = AppDataSource.getRepository(Coach);
            const coaches = await coachRepository.find({where:{team:{id:team_id}}});
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
