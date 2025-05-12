import { NextRequest, NextResponse } from "next/server";
import { getCompetitionById } from "@/controllers/competitions/competition.controller";

export const GET = async (
    req: NextRequest,
    { params }: { params: { id: string, competition_id: string } }
) => {
    try {
        console.log("Params received:", params);

        if (!params.id || !params.competition_id) {
            return NextResponse.json(
                { error: "Sport Type ID and Competition ID are required" },
                { status: 400 }
            );
        }
        if (!params.id || !params.competition_id) {
            return NextResponse.json(
                { error: "Sport Type ID and Competition ID are required" },
                { status: 400 }
            );
        }

        const response = await getCompetitionById(params);
        return response;
    } catch (error) {
        console.error("Error in GET /api/competitions/[sport_type_id]/[competition_id]:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
};
