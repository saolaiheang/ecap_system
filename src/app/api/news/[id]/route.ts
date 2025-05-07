import { NextRequest, NextResponse } from "next/server";
import { getNewsByIdTypeOfSport,deleteNews,updateNews } from "@/controllers/news/news.controller";
export const GET = async (req: NextRequest, context: { params: { id: string } }) => {
    try {
        const news = await getNewsByIdTypeOfSport(req, context);
        return news

    } catch (error) {
        return NextResponse.json({ error: "Error getting news" })
    }

}
export const DELETE = async(req:NextRequest,context:{params:{id:string}})=>{
    try {
        const news = await deleteNews(req, context);
        return news

    } catch (error) {
        return NextResponse.json({ error: "Error getting news" })
    }

}
export const PUT= async (req:NextRequest, context:{params:{id:string}})=>{
    try {
        const news = await updateNews(req, context);
        return news

    } catch (error) {
        return NextResponse.json({ error: "Error getting news" })
    }

}