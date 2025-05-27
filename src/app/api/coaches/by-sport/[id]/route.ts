import { getCoachesBysport, SportParams } from "@/controllers/coachs/coach.controller";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest,context:SportParams) {
    return await getCoachesBysport(req,context);
    
}