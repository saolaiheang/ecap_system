import { NextRequest, NextResponse } from "next/server";
import { AppDataSource } from "@/config";
import { Match, Team, SportType, Competition, MatchTeam } from "@/entities";
import { initializeDataSource } from "@/utils/inititializeDataSource";

// Interface for request body typing
interface MatchInput {
    match_date: Date;
    location: string;
    competition_id: string;
    sport_type_id: string;
    teamA_id: string;
    teamB_id: string;
}

export const createMatch = async (req: NextRequest) => {
    try {
        // await initializeDataSource();
        (async () => {
            await initializeDataSource();
            console.log("App is running...");
        })();

        const { match_date, location, competition_id, sport_type_id, teamA_id, teamB_id } = await req.json() as MatchInput;

        // Validate required fields
        if (!match_date || !location || !competition_id || !sport_type_id || !teamA_id || !teamB_id) {
            return NextResponse.json(
                { error: "match_date, location, competition_id, sport_type_id, teamA_id, and teamB_id are required" },
                { status: 400 }
            );
        }

        // Validate related entities
        const sportTypeRepository = AppDataSource.getRepository(SportType);
        const competitionRepository = AppDataSource.getRepository(Competition);
        const teamRepository = AppDataSource.getRepository(Team);

        const sportType = await sportTypeRepository.findOne({ where: { id: sport_type_id } });
        if (!sportType) {
            return NextResponse.json(
                { error: "Sport type not found" },
                { status: 404 }
            );
        }

        const competition = await competitionRepository.findOne({ where: { id: competition_id } });
        if (!competition) {
            return NextResponse.json(
                { error: "Competition not found" },
                { status: 404 }
            );
        }

        const teamA = await teamRepository.findOne({ where: { id: teamA_id } });
        const teamB = await teamRepository.findOne({ where: { id: teamB_id } });
        if (!teamA || !teamB) {
            return NextResponse.json(
                { error: "One or both teams not found" },
                { status: 404 }
            );
        }

        // Create Match
        const matchRepository = AppDataSource.getRepository(Match);
        const match = matchRepository.create({
            match_date,
            location,
            competition_id,
            sport_type_id,
        });

        await matchRepository.save(match);

        // Create MatchTeam entries for both teams
        const matchTeamRepository = AppDataSource.getRepository(MatchTeam);
        const matchTeamA = matchTeamRepository.create({
            match_id: match.id,
            team_id: teamA_id,
            team_role: "home",
        });
        const matchTeamB = matchTeamRepository.create({
            match_id: match.id,
            team_id: teamB_id,
            team_role: "away",
        });

        await matchTeamRepository.save([matchTeamA, matchTeamB]);

        // Fetch the saved match with relations
        const savedMatch = await matchRepository.findOne({
            where: { id: match.id },
            relations: ["sportType", "competition", "matchTeams", "matchTeams.team"],
        });

        if (!savedMatch) {
            return NextResponse.json(
                { error: "Match not saved correctly" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "Match created successfully", data: savedMatch },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating match:", error);
        return NextResponse.json(
            { error: "Error creating match" },
            { status: 500 }
        );
    }
};

export const getMatch = async (req: NextRequest) => {
    try {
        await initializeDataSource();

        const matchRepository = AppDataSource.getRepository(Match);
        const matches = await matchRepository.find({
            relations: ["sportType", "competition", "matchTeams", "matchTeams.team"],
        });

        return NextResponse.json(
            { data: matches },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error getting matches:", error);
        return NextResponse.json(
            { error: "Error getting matches" },
            { status: 500 }
        );
    }
};

export const getMatchById = async (req: NextRequest, context: { params: { id: string } }) => {
    try {
        await initializeDataSource();

        const { id } = context.params;
        const matchRepository = AppDataSource.getRepository(Match);
        const match = await matchRepository.findOne({
            where: { id },
            relations: ["sportType", "competition", "matchTeams", "matchTeams.team"],
        });

        if (!match) {
            return NextResponse.json(
                { error: "Match not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { data: match },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error getting match by ID:", error);
        return NextResponse.json(
            { error: "Error getting match" },
            { status: 500 }
        );
    }
};

export const updateMatch = async (req: NextRequest, context: { params: { id: string } }) => {
    try {
        await initializeDataSource();

        const { id } = context.params;
        const { match_date, location, competition_id, sport_type_id, teamA_id, teamB_id } = await req.json() as MatchInput;

        const matchRepository = AppDataSource.getRepository(Match);
        const match = await matchRepository.findOne({ where: { id } });
        if (!match) {
            return NextResponse.json(
                { error: "Match not found" },
                { status: 404 }
            );
        }

        // Validate related entities if provided
        const sportTypeRepository = AppDataSource.getRepository(SportType);
        const competitionRepository = AppDataSource.getRepository(Competition);
        const teamRepository = AppDataSource.getRepository(Team);

        if (sport_type_id) {
            const sportType = await sportTypeRepository.findOne({ where: { id: sport_type_id } });
            if (!sportType) {
                return NextResponse.json(
                    { error: "Sport type not found" },
                    { status: 404 }
                );
            }
        }

        if (competition_id) {
            const competition = await competitionRepository.findOne({ where: { id: competition_id } });
            if (!competition) {
                return NextResponse.json(
                    { error: "Competition not found" },
                    { status: 404 }
                );
            }
        }

        // Update Match
        match.match_date = match_date || match.match_date;
        match.location = location || match.location;
        match.competition_id = competition_id || match.competition_id;
        match.sport_type_id = sport_type_id || match.sport_type_id;

        await matchRepository.save(match);

        // Update MatchTeam entries if teams are provided
        if (teamA_id || teamB_id) {
            const matchTeamRepository = AppDataSource.getRepository(MatchTeam);
            const existingMatchTeams = await matchTeamRepository.find({ where: { match_id: id } });

            // Remove existing MatchTeam entries
            await matchTeamRepository.remove(existingMatchTeams);

            // Validate new teams
            const teamA = teamA_id ? await teamRepository.findOne({ where: { id: teamA_id } }) : null;
            const teamB = teamB_id ? await teamRepository.findOne({ where: { id: teamB_id } }) : null;
            if ((teamA_id && !teamA) || (teamB_id && !teamB)) {
                return NextResponse.json(
                    { error: "One or both teams not found" },
                    { status: 404 }
                );
            }

            // Create new MatchTeam entries
            const matchTeams = [];
            if (teamA_id) {
                matchTeams.push(matchTeamRepository.create({
                    match_id: match.id,
                    team_id: teamA_id,
                    team_role: "home",
                }));
            }
            if (teamB_id) {
                matchTeams.push(matchTeamRepository.create({
                    match_id: match.id,
                    team_id: teamB_id,
                    team_role: "away",
                }));
            }
            await matchTeamRepository.save(matchTeams);
        }

        const updatedMatch = await matchRepository.findOne({
            where: { id },
            relations: ["sportType", "competition", "matchTeams", "matchTeams.team"],
        });

        return NextResponse.json(
            { message: "Match updated successfully", data: updatedMatch },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating match:", error);
        return NextResponse.json(
            { error: "Error updating match" },
            { status: 500 }
        );
    }
};

export const deleteMatch = async (req: NextRequest, context: { params: { id: string } }) => {
    try {
        await initializeDataSource();

        const { id } = context.params;
        const matchRepository = AppDataSource.getRepository(Match);

        const match = await matchRepository.findOne({ where: { id } });
        if (!match) {
            return NextResponse.json(
                { error: "Match not found" },
                { status: 404 }
            );
        }

        await matchRepository.remove(match);

        return NextResponse.json(
            { message: "Match deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting match:", error);
        return NextResponse.json(
            { error: "Error deleting match" },
            { status: 500 }
        );
    }
};