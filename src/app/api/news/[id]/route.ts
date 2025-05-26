import { NextRequest, NextResponse } from "next/server";
import { getNewsByIdTypeOfSport,deleteNews,updateNews,getNewsById } from "@/controllers/news/news.controller";

export const DELETE = async(req:NextRequest,context:{params:{id:string}})=>{
    try {
        const news = await deleteNews(req, context);
        return news

    } catch (error) {
        return NextResponse.json({ error: "Error getting news",message:error })
    }

}
export const PUT= async (req:NextRequest, context:{params:{id:string}})=>{
    try {
        const news = await updateNews(req, context);
        return news

    } catch (error) {
        return NextResponse.json({ error: "Error getting news",message:error })
    }

}
export const GET = async (req: NextRequest, context: { params: { id:string}})=>{
    return await getNewsById(req,context);
}