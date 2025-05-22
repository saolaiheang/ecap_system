import { NextRequest} from "next/server";
import { createPlayer, getPlayersByteams } from "@/controllers/players/players.controller";

export const POST = async (req: NextRequest, context: { params: { id: string } }) => {
    return await createPlayer(req, context);
}
export const GET = async (req: NextRequest, context: {
    params: { id: string }
}) => {
    return await getPlayersByteams(req, context);
}

export const config = {
    api: {
        bodyParser: false,
    },
};