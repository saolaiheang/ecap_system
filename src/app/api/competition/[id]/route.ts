import { NextRequest, NextResponse } from "next/server";
import { createCompetion,getCompetitionBytypeOfsport ,updateCompetition,deleteCompetition} from "@/controllers/competition/competition.controller";
export const POST = async (req: NextRequest, { params }: { params: { sport_id: string } }) => {
    try {
        const { sport_id } = params;
        const { name, location, start_date } = await req.json();
        if (!name || !location || !start_date || !sport_id) {
            return NextResponse.json({ message: "Missing parameters" }, { status: 400 });
        }
        const response = await createCompetion(name, location, new Date(start_date), sport_id);
        return NextResponse.json(response, { status: 201 })
    } catch (error) {
        return NextResponse.json({ message: "internal server error" }, { status: 500 })
    }

}
export const GET = async (req: NextRequest, { params }: { params: { sport_id:string } }) => {
    try {
        const { sport_id } = params;
        const response = await getCompetitionBytypeOfsport(sport_id);
        return NextResponse.json(response, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: "internal server error" }, { status: 500 })
    }

}
export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const { id } = params;

        const { name, location, start_date, sport_id } = await req.json();

        if (!name || !location || !start_date || !sport_id) {
            return NextResponse.json({ message: "Missing parameters" }, { status: 400 });
        }

        const response = await updateCompetition(id, name, location, new Date(start_date), sport_id);

        return NextResponse.json(response, { status: response.status });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
};

export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const { id } = params;

        const response = await deleteCompetition(id);

        return NextResponse.json(response, { status: response.status });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
};