import { NextRequest, NextResponse } from "next/server";
import {
    updateCompetition,
    deleteCompetition,
    CompetitionParams,
} from "@/controllers/competitions/competition.controller";

export const PUT = async (req: NextRequest, context:CompetitionParams) => {
    try {
        const response = await updateCompetition(req,context);
        return response; 
    } catch (error) {
        console.error("Error in PUT /api/competitions/[id]:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
};
export const DELETE = async (req: NextRequest, context:CompetitionParams) => {
    try {
        const response = await deleteCompetition(req,context);
        return response;
    } catch (error) {
        console.error("Error in DELETE /api/competitions/[id]:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
};