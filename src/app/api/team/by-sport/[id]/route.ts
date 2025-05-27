import { NextRequest,NextResponse } from "next/server";
import { getTeamsByTypeOf, TeamParams } from "@/controllers/team/team.controller";

export const GET = async (req: NextRequest, context: TeamParams) => {
    try {
        const response = await getTeamsByTypeOf(req, context);
        return response;
    } catch (error) {
        console.error("Error in GET /api/team/by-sport/:id:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
};
