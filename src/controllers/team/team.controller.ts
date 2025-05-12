
import { NextRequest, NextResponse } from "next/server";
import { AppDataSource } from "@/config";
import { Team, SportType } from "@/entities";
import { initializeDataSource } from "@/utils/inititializeDataSource";
export const createTeam = async (req: NextRequest) => {
    try {
        await initializeDataSource();
        const { name, division, sport_id, contact_info ,image} = await req.json();
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
        const team = teamRepository.create({
            name,
            division,
            sportType,
            contact_info: contact_info || null,
            image: image || null
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

export const getTeams = async (req: NextRequest) => {
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

export const updateTeam= async (req: NextRequest, context: { params: { id: string } }) => {
    try {
        await initializeDataSource();
        const { id } = context.params;
        const { name, division,contact_info } = await req.json();
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