import { NextRequest, NextResponse } from "next/server";
import {
    createCompetition,
    updateCompetition,
    deleteCompetition,
} from "@/controllers/competitions/competition.controller";

// POST: Create a new competition
export const POST = async (req: NextRequest) => {
    try {
        const response = await createCompetition(req);
        return response; // createCompetition already returns a NextResponse
    } catch (error) {
        console.error("Error in POST /api/competitions:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
};

// GET: Placeholder (or implement getCompetitionById in the controller)
export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const { id } = params;
        // Since getCompetitionById isn't implemented, return a placeholder
        return NextResponse.json(
            { error: "GET by ID not implemented. Use GET /api/competitions/by-sport/[sport_id] to fetch by sport type." },
            { status: 501 }
        );
    } catch (error) {
        console.error("Error in GET /api/competitions/[id]:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
};

// PUT: Update a specific competition by ID
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

// DELETE: Delete a specific competition by ID
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