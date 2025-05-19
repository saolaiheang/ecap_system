import { NextRequest } from "next/server";
import { createHistory,getAllHistory } from "@/controllers/histories/histories.controller";
export const POST = async (req: NextRequest) => {
    return await createHistory(req);

}
export const GET = async (req: NextRequest) =>{
    return await getAllHistory(req);
}