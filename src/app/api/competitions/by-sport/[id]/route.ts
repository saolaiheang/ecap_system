import { NextRequest, NextResponse } from "next/server";
import {
    getCompetitionByTypeOfSport
} from "@/controllers/competitions/competition.controller";



export const GET = async (
    request: NextRequest,
    { params }: { params: { id: string } }) => {
    try {
        console.log("Context params received:", params);
        if (!params || !params.id) {
            console.error("No ID found in params.");
            return NextResponse.json(
                { error: "Sport ID is required" },
                { status: 400 }
            );
        }
        const response = await getCompetitionByTypeOfSport(params);

        return response;
    } catch (error) {
        console.error("Error in GET /api/competitions/[id]:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
};