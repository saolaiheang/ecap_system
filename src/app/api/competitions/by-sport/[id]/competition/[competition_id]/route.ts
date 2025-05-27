import { NextRequest, NextResponse } from "next/server";
import { getCompetitionById, CompetitionParams } from "@/controllers/competitions/competition.controller";

export const GET = async (req: NextRequest, context: CompetitionParams) => {
  try {
    const { id, competition_id } = await context.params; 

    console.log("Params received:", { id, competition_id });

    if (!id || !competition_id) {
      return NextResponse.json(
        { error: "Sport Type ID and Competition ID are required" },
        { status: 400 }
      );
    }

    const response = await getCompetitionById(req, context);
    return response;
  } catch (error) {
    console.error("Error in GET /api/competitions/[id]/[competition_id]:", error);
    return NextResponse.json({ error: "Failed to get competition" }, { status: 500 });
  }
};