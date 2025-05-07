import { NextRequest, NextResponse } from "next/server";
import { getTypeOfSportById, updateTypeOfSport, deleteTypeOfSport } from "@/controllers/typeOfsport/typeOfsport.controller";
export const GET = async (req: NextRequest, context: { params: { id: string } }) => {
    try {
        const response = await getTypeOfSportById(req, context);
        return response;
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
};
export const PUT = async (req: NextRequest, context: { params: { id: string } }) => {
    try {
        const response = await updateTypeOfSport(req, context);
        return response;
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }

}
export const DELETE = async (req: NextRequest, context: { params: { id: string } }) => {
    try {
        const response = await deleteTypeOfSport(req, context);
        return response;
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
