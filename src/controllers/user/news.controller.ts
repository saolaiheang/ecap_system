import { NextRequest,NextResponse } from "next/server";
import { News } from "@/entities";
import { AppDataSource } from "@/config";
export const createNews = async (req: NextRequest) => {
    try {
        const { title, description, image,typeOfSport } = await req.json();
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        const news = AppDataSource.getRepository(News).create({
            title,
            description,
            image,
            typeOfSport,
            
        });
        if (!title || !description || !image) {
            return NextResponse.json({ error: 'Title, description and image are required' },
                { status: 400 }
            )
        }
        await AppDataSource.manager.save(news);
        return NextResponse.json({ message: 'News created successfully' },
            { status: 201 }
        )
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Error creating news' },
            { status: 500 }
        )
    }
}

export const getNews= async (req:NextRequest)=>{
    try{
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        const news = await AppDataSource.getRepository(News).find();
        return NextResponse.json(news)
    }
    catch(error){
        console.log(error);
        return NextResponse.json({error:"Error getting news"})
    }
}

export const getNewsByIdTypeOfSport = async (req:NextRequest,context:{params:{id:string}})=>{
    try{
        const {id} = context.params;
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        const news = await AppDataSource.getRepository(News).find({where:{typeOfSport:{id:id}},  relations: ['typeOfSport']})
        return NextResponse.json(news)
    }
    catch(error){
        console.log(error);
        return NextResponse.json({error:"Error getting news"})
    }
}
export const deleteNews = async (req:NextRequest, context:{params:{id:string}})=>{
    try{
        const {id} = context.params;
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        const news = await AppDataSource.getRepository(News).findOne({where:{id:id}})
        if(!news){
            return NextResponse.json({error:"News not found"})
        }
        await AppDataSource.getRepository(News).remove(news);
        return NextResponse.json({message:"News deleted successfully"})
    }
    catch(error){
        console.log(error);
        return NextResponse.json({error:"Error deleting news"})
    }
}
export const updateNews = async (req:NextRequest, context:{params:{id:string}})=>{
    try{
        const {id} = context.params;
        const {title, description, image,typeOfSport} = await req.json();
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        const news = await AppDataSource.getRepository(News).findOne({where:{id:id}})
        if(!news){
            return NextResponse.json({error:"News not found"})
        }
        news.title = title;
        news.description = description;
        news.image = image;
        news.typeOfSport = typeOfSport;
        await AppDataSource.getRepository(News).save(news);
        return NextResponse.json({message:"News updated successfully"})
    }
    catch(error){
        console.log(error);
        return NextResponse.json({error:"Error updating news"})
    }
}
