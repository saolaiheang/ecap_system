import { NextRequest,NextResponse } from "next/server";
import { getPlayers } from "@/controllers/players/players.controller";
export const GET = async (req: NextRequest) => {
  const players = await getPlayers(req);
  return players;
};