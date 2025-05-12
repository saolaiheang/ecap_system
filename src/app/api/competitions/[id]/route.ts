import { NextRequest, NextResponse } from "next/server";
import {
    updateCompetition,
    deleteCompetition,
} from "@/controllers/competitions/competition.controller";
export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const response = await updateCompetition(req, { params });
        return response; 
    } catch (error) {
        console.error("Error in PUT /api/competitions/[id]:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
};
export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const response = await deleteCompetition(req, { params });
        return response;
    } catch (error) {
        console.error("Error in DELETE /api/competitions/[id]:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
};