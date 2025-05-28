import { NextRequest } from "next/server";
import { createMatchFriendly, getMatchFriendlyBySport, MatchFriendlyParams } from "@/controllers/match_friendly.controller/match_friendly";

export const POST = async (req: NextRequest, context: MatchFriendlyParams) => {
    return await createMatchFriendly(req, context);
}
export const GET = async (req: NextRequest, context: MatchFriendlyParams) => {
    return await getMatchFriendlyBySport(req, context);
} 