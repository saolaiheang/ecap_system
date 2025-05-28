import { NextRequest } from "next/server";
import { createCoach, getCoachesByteam, TeamParams } from "@/controllers/coachs/coach.controller";
export const POST = async (req: NextRequest, context:TeamParams) => {
    return await createCoach(req, context);

}

export const GET = async (req: NextRequest, context:TeamParams) => {
    return await getCoachesByteam(req, context);
}
