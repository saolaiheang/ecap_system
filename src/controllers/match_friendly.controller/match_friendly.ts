import { NextRequest, NextResponse } from "next/server";
import { MatchFriendly, SportType, Team } from "@/entities";
import { initializeDataSource } from "@/utils/inititializeDataSource";
import { AppDataSource } from "@/config";

export const createMatchFriendly = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const { id: sport_type_id } = params;
        await initializeDataSource();
        const { match_date, match_time, location, status, teamA_id, teamB_id, teamA_score, teamB_score } = await req.json();
        const sportType = await AppDataSource.getRepository(SportType).findOneBy({
            id: sport_type_id,
        });
        if (!sportType) {
            return NextResponse.json({ message: "Sport type not found" }, { status: 404 });
        }
        const teamRepo = AppDataSource.getRepository(Team);
        const [teamA, teamB] = await Promise.all([
            teamRepo.findOneBy({ id: teamA_id }),
            teamRepo.findOneBy({ id: teamB_id }),
        ]);
        if (!teamA || !teamB) {
            return NextResponse.json({ message: "One or both teams not found" }, { status: 404 });
        }
        const matchRepository = AppDataSource.getRepository(MatchFriendly);
        const matchFriendly = matchRepository.create({
            sport_type_id,
            match_date,
            match_time,
            location,
            status,
            teamA_id,
            teamB_id,
            teamA_score,
            teamB_score
        });
        await matchRepository.save(matchFriendly);
        return NextResponse.json({ message: "Match friendly created successfully", data: matchFriendly });

    } catch (error) {
        console.error("Error getting Match Friendly:", error);
        return NextResponse.json(
            { error: "Error getting Match Friendly" },
            { status: 500 }
        );

    }
}
export const getMatchFriendlyById = async (_req: NextRequest, { params }: { params: { id: string } }
) => {
    try {
        const { id } = params;
        await initializeDataSource();
        const matchFriendly = await AppDataSource.getRepository(MatchFriendly).findOne({ where: { id }, relations: ["teamB", "teamA", "sportType"] });
        if (!matchFriendly) {
            return NextResponse.json({ message: "Match not found" }, { status: 404 });
        }
        return NextResponse.json(matchFriendly);
    } catch (error) {
        console.error("Error getting Match Friendly:", error);
        return NextResponse.json(
            { error: "Error getting Match Friendly" },
            { status: 500 }
        );
    }
}

export const getMatchFriendlyBySport = async (_req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const { id } = params;
        await initializeDataSource();
        const matchFriendly = await AppDataSource.getRepository(MatchFriendly).find({
            where: {
                sport_type_id: id
            }, relations: ["teamB", "teamA", "sportType"]
        });
        if (!matchFriendly) {
            return NextResponse.json({ message: "Match not found" }, { status: 404 });
        }
        return NextResponse.json(matchFriendly);
    } catch (error) {
        console.error("Error getting Match Friendly:", error);
        return NextResponse.json(
            { error: "Error getting Match Friendly" },
            { status: 500 }
        );
    }
}
export const deleteMatchFriendlyById = async (_req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const { id } = params;
        await initializeDataSource();
        const matchFriendly = await AppDataSource.getRepository(MatchFriendly).findOne({ where: { id } });
        if (!matchFriendly) {
            return NextResponse.json({ message: "Match not found" }, { status: 404 });
        }
        await AppDataSource.getRepository(MatchFriendly).delete(id);
        return NextResponse.json({ message: "Match deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting Match Friendly:", error);
        return NextResponse.json(
            { error: "Error deleting Match Friendly" },
            { status: 500 }
        );
    }

}
export const updateMatchFriendlyById = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const { id } = params;
        await initializeDataSource();
        const matchFriendly = await AppDataSource.getRepository(MatchFriendly).findOne({
            where: {
                id
            }
        });
        if (!matchFriendly) {
            return NextResponse.json({ message: "Match not found" }, { status: 404 });
        }
        const { status, teamA_score, teamB_score } = await req.json();

        matchFriendly.status = status;
        matchFriendly.teamA_score = teamA_score;
        matchFriendly.teamB_score = teamB_score;
        await AppDataSource.getRepository(MatchFriendly).save(matchFriendly);
        return NextResponse.json({ message: "Match updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error updating Match Friendly:", error);
        return NextResponse.json(
            { error: "Error updating Match Friendly" },
            { status: 500 }
        );
    }

}

export const getAllMatch = async () => {
    try {
        await initializeDataSource();
        const matchFriendly = await AppDataSource.getRepository(MatchFriendly).find();
        return NextResponse.json(matchFriendly, { status: 200 });
    } catch (error) {
        console.error("Error getting all Match Friendly:", error);
        return NextResponse.json(
            { error: "Error getting all Match Friendly" },
            { status: 500 }
        );
    }

}