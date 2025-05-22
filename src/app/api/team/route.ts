import { NextRequest } from "next/server";
import { createTeam ,getTeams} from "@/controllers/team/team.controller"; // Adjust the path if needed

export const POST = async (req: NextRequest) => {
    return await createTeam(req);
};

export const GET = async (req: NextRequest) => {
    return await getTeams(req);
};
