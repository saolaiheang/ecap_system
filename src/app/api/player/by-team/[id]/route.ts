import { NextRequest} from "next/server";
import { createPlayer, getPlayersByteams, PlayerParams } from "@/controllers/players/players.controller";

export const POST = async (req: NextRequest, context: PlayerParams) => {
    return await createPlayer(req, context);
}
export const GET = async (req: NextRequest, context:PlayerParams) => {
    return await getPlayersByteams(req, context);
}

export const config = {
    api: {
        bodyParser: false,
    },
};