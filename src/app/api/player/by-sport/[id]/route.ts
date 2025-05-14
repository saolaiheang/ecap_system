import { getPlayerBySport } from "@/controllers/players/players.controller";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest,{params}: { params: { id: string } }) {
    return await getPlayerBySport({params});
    
}