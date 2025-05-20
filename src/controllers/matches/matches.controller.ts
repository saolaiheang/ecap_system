
import { NextRequest, NextResponse } from "next/server";
import { initializeDataSource } from "@/utils/inititializeDataSource";
import { Match, SportType, Stage, Team } from "@/entities";
import { AppDataSource } from "@/config";
import { MatchStatus } from "@/entities/match";
import { z } from "zod";
import { matches } from "class-validator";


const createMatchSchema = z.object({
  matchDate: z.string().datetime({ message: "Invalid match date" }),
  location: z.string().min(1, "Location is required").max(255),
  sport_type_id: z.string().uuid("Invalid sport type ID"),
  teamA_id: z.string().uuid("Invalid Team A ID"),
  teamB_id: z.string().uuid("Invalid Team B ID"),
  status: z
    .enum(["scheduled", "in_progress", "completed", "cancelled"])
    .optional()
    .default("scheduled"),
  teamA_score: z.number().int().nonnegative().nullable().optional(),
  teamB_score: z.number().int().nonnegative().nullable().optional(),
});

export const createMatch = async (
  req: NextRequest,
  { params }: { params: { stage_id: string } }
) => {
  try {
    const body = await req.json();
    const parsed = createMatchSchema.parse(body);

    const stageIdSchema = z.string().uuid("Invalid stage ID");
    const { stage_id } = { stage_id: stageIdSchema.parse(params.stage_id) };

    await initializeDataSource();

    const stage = await AppDataSource.getRepository(Stage).findOneBy({ id: stage_id });
    if (!stage) {
      return NextResponse.json({ error: "Stage not found" }, { status: 404 });
    }

    const sportType = await AppDataSource.getRepository(SportType).findOneBy({
      id: parsed.sport_type_id,
    });
    if (!sportType) {
      return NextResponse.json({ message: "Sport type not found" }, { status: 404 });
    }

    const teamRepo = AppDataSource.getRepository(Team);
    const [teamA, teamB] = await Promise.all([
      teamRepo.findOneBy({ id: parsed.teamA_id }),
      teamRepo.findOneBy({ id: parsed.teamB_id }),
    ]);
    if (!teamA || !teamB) {
      return NextResponse.json({ message: "One or both teams not found" }, { status: 404 });
    }



    const matchRepository = AppDataSource.getRepository(Match);
    const match = matchRepository.create({
      match_date: new Date(parsed.matchDate),
      location: parsed.location,
      status: parsed.status ?? MatchStatus.SCHEDULED,
      stage_id,
      sport_type_id: parsed.sport_type_id,
      teamA_id: parsed.teamA_id,
      teamB_id: parsed.teamB_id,
      teamA_score: parsed.teamA_score ?? null,
      teamB_score: parsed.teamB_score ?? null,
    });

    await matchRepository.save(match);

    return NextResponse.json({ message: "Match created successfully", data: match });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
};
