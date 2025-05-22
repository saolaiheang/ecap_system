import { NextRequest } from "next/server";
import { createCoach, getCoachesByteam } from "@/controllers/coachs/coach.controller";
export const POST = async (req: NextRequest, context: { params: { id: string } }) => {
    return await createCoach(req, context);

}

export const GET = async (req: NextRequest, context: {params: { id: string }}) => {
    return await getCoachesByteam(req, context);
}
