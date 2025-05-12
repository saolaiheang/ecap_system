import { NextRequest, NextResponse } from "next/server";
import {
    createCompetition,
} from "@/controllers/competitions/competition.controller";


export const POST = async (req: NextRequest) => {
    try {
        const response = await createCompetition(req);
        return response; 
    } catch (error) {
        console.error("Error in POST /api/competitions:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
};
