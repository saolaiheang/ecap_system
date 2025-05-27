import { getPlayerBySport, PlayerParams } from "@/controllers/players/players.controller";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest,context:PlayerParams) {
    return await getPlayerBySport(req,context);
    
}