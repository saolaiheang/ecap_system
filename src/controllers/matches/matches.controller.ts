
import { NextRequest, NextResponse } from "next/server";
import { initializeDataSource } from "@/utils/inititializeDataSource";
import { Match, SportType, Stage, Team } from "@/entities";
import { AppDataSource } from "@/config";
import { MatchStatus } from "@/entities/match";
export const createMatch = async (req: NextRequest, { params }: { params: { id: string; stage_id: string } }) => {
  try {
    const { stage_id, id: competition_id } = params;

    await initializeDataSource();
    const { match_date, match_time, location, status, sport_type_id, teamA_id, teamB_id, teamA_score, teamB_score } = await req.json();

    const stage = await AppDataSource.getRepository(Stage).findOneBy({ id: stage_id, competition: { id: competition_id } });
    if (!stage) {
      return NextResponse.json({ error: "Stage not found" }, { status: 404 });
    }

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
    const matchRepository = AppDataSource.getRepository(Match);
    const match = matchRepository.create({
      match_date,
      match_time,
      location: location,
      status: status ?? MatchStatus.SCHEDULED,
      stage_id,
      sport_type_id: sport_type_id,
      teamA_id: teamA_id,
      teamB_id: teamB_id,
      teamA_score: teamA_score ?? null,
      teamB_score: teamB_score ?? null,
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

export const getAllMatchByStage = async (_req: NextRequest, { params }: { params: { id: string, stage_id: string } }) => {
  try {

    const { stage_id, id: competition_id } = params;
    await initializeDataSource();
    const stage = await AppDataSource.getRepository(Stage).findOneBy({ id: stage_id, competition: { id: competition_id } })
    console.log(stage, ",,,,,,,,,,,")
    if (!stage) {
      return NextResponse.json({ error: "Stage not found" }, { status: 404 });
    }
    const matchRepository = AppDataSource.getRepository(Match);
    const matches = await matchRepository.find({
      where: { stage_id },
      relations: ["teamA", "teamB", "sportType"],
      order: { match_date: "ASC", match_time: "ASC" },
      take: 50,
      skip: 0,
    });
    return NextResponse.json({ data: matches });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
export const getMatchById = async (_req: NextRequest, { params }: { params: { id: string, stage_id: string, match_id: string } }) => {
  try {
    const { stage_id, id: competition_id, match_id } = params;
    await initializeDataSource();
    const stage = await AppDataSource.getRepository(Stage).findOneBy({ id: stage_id, competition: { id: competition_id } })
    console.log(stage, ",,,,,,,,,,,")
    if (!stage) {
      return NextResponse.json({ error: "Stage not found" }, { status: 404 });
    }
    const matchRepository = AppDataSource.getRepository(Match);
    const match = await matchRepository.findOne({ where: { id: match_id, stage_id }, relations: ["teamA", "teamB", "sportType"] },)
    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 })
    }
    return NextResponse.json({ data: match })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

export const deleteMatch = async (_req: NextRequest, { params }: { params: { id: string, stage_id: string, match_id: string } }) => {
  try {
    const { stage_id, id: competition_id, match_id } = params;
    await initializeDataSource();
    const stage = await AppDataSource.getRepository(Stage).findOneBy({
      id: stage_id,
      competition: { id: competition_id }
    })
    console.log(stage, ",,,,,,,,,,,")
    if (!stage) {
      return NextResponse.json({ error: "Stage not found" }, { status: 404 });
    }
    const matchRepository = AppDataSource.getRepository(Match);
    const match = await matchRepository.findOne({
      where: { id: match_id, stage_id },
      relations: ["teamA", "teamB", "sportType"]
    },)
    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 })
    }
    await matchRepository.delete(match_id)
    return NextResponse.json({ data: "Match deleted" })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

export const updateMatch = async (req: NextRequest, { params }: { params: { id: string, stage_id: string, match_id: string } }) => {
  try {
    const { stage_id, id: competition_id, match_id } = params;
    await initializeDataSource();
    const stage = await AppDataSource.getRepository(Stage).findOneBy({
      id: stage_id,
      competition: { id: competition_id }
    })
    if (!stage) {
      return NextResponse.json({ error: "Stage not found" }, { status: 404 });
    }
    const matchRepository = AppDataSource.getRepository(Match);
    const match = await matchRepository.findOne({
      where: { id: match_id, stage_id },
      relations: ["teamA", "teamB", "sportType"]
    })
    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 })
    }
    const { match_date, match_time, location, status } = await req.json();
    const updatedMatch = await matchRepository.update(match_id, {
      match_date,
      match_time,
      location,
      status: status ?? MatchStatus.SCHEDULED,
    });

    return NextResponse.json({ message: "Match update successfully", data: updatedMatch })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}


export const getAllMatch = async (_req: NextRequest) => {
  try {

    await initializeDataSource();
    const matchRepository = AppDataSource.getRepository(Match);
    const matches = await matchRepository.find({
      relations: ["teamA", "teamB", "sportType"],
      where: { status: MatchStatus.SCHEDULED }
    });
    console.log(matches)
    return NextResponse.json({ data: matches })

  }
  catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }

}