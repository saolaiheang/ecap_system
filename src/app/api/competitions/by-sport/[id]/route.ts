import { NextRequest, NextResponse } from "next/server";
import {
    getCompetitionByTypeOfSport,
    SportParams
} from "@/controllers/competitions/competition.controller";



export const GET = async (req: NextRequest,context:SportParams) => {
    try {
        return await getCompetitionByTypeOfSport(req,context)
    } catch (error) {
        console.error("Error in GET /api/competitions/[id]:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
};