import { getCoachesBysport } from "@/controllers/coachs/coach.controller";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest,{params}: { params: { id: string } }) {
    return await getCoachesBysport({params});
    
}